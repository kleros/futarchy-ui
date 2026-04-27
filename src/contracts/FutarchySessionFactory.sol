// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISeerMarketFactory {
    struct CreateMarketParams {
        string marketName;
        string[] outcomes;
        string questionStart;
        string questionEnd;
        string outcomeType;
        uint256 parentOutcome;
        address parentMarket;
        string category;
        string lang;
        uint256 lowerBound;
        uint256 upperBound;
        uint256 minBond;
        uint32 openingTime;
        string[] tokenNames;
    }

    function createCategoricalMarket(CreateMarketParams calldata params) external returns (address market);

    function createScalarMarket(CreateMarketParams calldata params) external returns (address market);
}

/// @title FutarchyFactory
/// @notice Permissionless orchestrator around Seer’s `MarketFactory`: one categorical parent and one scalar child per parent outcome in a single transaction.
/// @dev This contract trusts the Seer `MarketFactory` at `seerMarketFactory`. Market resolution, CTF conditions, and wrapped ERC20 behavior are entirely defined upstream; this wrapper only validates calldata shape, forwards calls, stores a session record, and emits events.
contract FutarchyFactory {

    // ************************************* //
    // *         Enums / Structs           * //
    // ************************************* //

    /// @notice On-chain record for a session
    /// @dev For phased deploys, `completedAt` is 0 until all children exist; `openedAt` is set when the parent is deployed.
    struct Session {
        address deployer; // Account that opened or atomically deployed the session (`msg.sender` at start).
        address parentMarket; // Seer categorical `Market` clone returned by `createCategoricalMarket`.
        address[] childMarkets; // Seer scalar clones; `childMarkets[i]` is parent outcome `i` (grows in phased mode).
        uint64 openedAt; // When the parent market was deployed.
        uint64 completedAt; // When all `expectedChildCount` children were deployed; 0 if still incomplete in phased mode.
        uint256 expectedChildCount; // `parent.outcomes.length`; fixed at parent deployment.
    }

    /// @notice Calldata subset for the parent categorical market passed to Seer `createCategoricalMarket`.
    /// @dev Becomes `ISeerMarketFactory.CreateMarketParams` with `questionStart`, `questionEnd`, `outcomeType` empty, bounds zero, and `parentMarket` zero.
    struct ParentCategoricalConfig {
        string marketName; // Encoded with `outcomes`, `category`, `lang` for the parent Reality question (Seer path).
        string[] outcomes; // The market outcomes, doesn't include the INVALID_RESULT outcome.
        string[] tokenNames; // Name of the ERC20 tokens associated to each outcome. Must include an empty string in last to account for Invalid Result token name.
        string category; // Reality metadata.
        string lang; // Reality metadata.
        uint256 minBond; // Reality `minBond` for the parent question.
        uint32 openingTime; // Reality `openingTime` for the parent question.
    }

    /// @notice Calldata for one scalar child bound to a single parent outcome index.
    /// @dev Row `i` in `DeployFutarchySessionParams.children` must have `parentOutcomeIndex == i`. Labels become Seer `outcomes` (length 2); bounds must satisfy Seer’s scalar template.
    struct ChildScalarConfig {
        uint256 parentOutcomeIndex; // Index into the parent’s `outcomes` array; must match the child’s position in `children`.
        string marketName; // Scalar Reality question (Seer `encodeRealityQuestionWithoutOutcomes` path).
        string outcomeLabelLow; // First scalar branch label (e.g. DOWN).
        string outcomeLabelHigh; // Second scalar branch label (e.g. UP).
        string tokenNameLow; // Wrapped ERC20 ticker for the low outcome.
        string tokenNameHigh; // Wrapped ERC20 ticker for the high outcome.
        uint256 lowerBound; // Scalar lower bound; must be strictly less than `upperBound`.
        uint256 upperBound; // Scalar upper bound; must be strictly below `type(uint256).max - 2`.
        uint256 minBond; // Reality `minBond` for this child.
        uint32 openingTime; // Reality `openingTime` for this child.
        string category; // Reality metadata for this child.
        string lang; // Reality metadata for this child.
    }

    /// @notice Top-level argument to `deployFutarchySession`.
    struct DeployFutarchySessionParams {
        ParentCategoricalConfig parent; // Parent categorical configuration.
        ChildScalarConfig[] children; // One entry per parent outcome, ordered by `parentOutcomeIndex`.
    }

    // ************************************* //
    // *             Storage               * //
    // ************************************* //

    ISeerMarketFactory public immutable seerMarketFactory; // TRUSTED
    /// @dev Seer scalar child markets use exactly two branch labels (e.g. DOWN/UP) in `outcomes`.
    uint256 private constant SCALAR_BRANCH_OUTCOME_COUNT = 2;
    /// @dev Seer’s wrapped ERC20 name list length for a market (low, high, invalid).
    uint256 private constant SEER_WRAPPED_TOKEN_NAME_SLOTS = 3;

    uint256 public sessionCount;
    mapping(uint256 sessionId => Session) public sessions;

    // ************************************* //
    // *              Events               * //
    // ************************************* //

    /// @notice Emitted immediately after Seer returns the parent categorical clone.
    /// @param sessionId Session identifier
    /// @param deployer `msg.sender` for this deployment.
    /// @param parentMarket Address of the parent `Market` clone.
    /// @param outcomeCount Length of `parent.outcomes` 
    event ParentMarketDeployed(
        uint256 indexed sessionId, address indexed deployer, address indexed parentMarket, uint256 outcomeCount
    );

    /// @notice Emitted after each scalar child clone is created for a parent outcome.
    /// @param sessionId Session identifier.
    /// @param parentOutcomeIndex Index of the parent outcome this child is tied to.
    /// @param childMarket Address of the scalar `Market` clone.
    /// @param parentMarket Parent market address.
    event ChildMarketDeployed(
        uint256 indexed sessionId, uint256 indexed parentOutcomeIndex, address indexed childMarket, address parentMarket
    );

    /// @notice Emitted when a phased session opens: full planned child scalar configs.
    /// @param sessionId Session identifier.
    /// @param children Full `ChildScalarConfig[]` passed in `openPhasedFutarchySession` (same ordering as `parent.outcomes`).
    event PhasedSessionChildConfigPublished(
        uint256 indexed sessionId, ChildScalarConfig[] children
    );

    // ************************************* //
    // *        Function Modifiers         * //
    // ************************************* //

    /// @dev Requires `sessionId` to be allocated and the caller to be the stored `deployer`.
    modifier onlySessionDeployer(uint256 sessionId) {
        if (sessionId >= sessionCount) revert InvalidSession();
        if (msg.sender != sessions[sessionId].deployer) revert NotSessionDeployer();
        _;
    }

    // ************************************* //
    // *            Constructor            * //
    // ************************************* //

    /// @notice Binds the initial Seer `MarketFactory` 
    /// @param _factory Seer `MarketFactory` implementation (trusted).
    constructor(ISeerMarketFactory _factory) {
        seerMarketFactory = _factory;
    }

    // ************************************* //
    // *             External              * //
    // ************************************* //

    /// @notice Deploys parent + one scalar child per categorical outcome in a single transaction.
    /// @param params Parent config and one `ChildScalarConfig` per outcome, ordered by `parentOutcomeIndex == 0..N-1`.
    /// @return sessionId Monotonic id assigned for this deployment.
    /// @return parentAddress Seer categorical market clone.
    /// @return childMarkets Seer scalar child clone per parent outcome, same order as `params.parent.outcomes`.
    function deployFutarchySession(DeployFutarchySessionParams calldata params)
        external
        returns (uint256 sessionId, address parentAddress, address[] memory childMarkets)
    {
        _validateParentAndChildren(params.parent, params.children);
        uint256 parentOutcomeCount = params.parent.outcomes.length;

        sessionId = sessionCount;
        address deployer = msg.sender;
        parentAddress = _seerCreateCategoricalParent(params.parent);

        if (parentAddress == address(0)) revert ZeroSeerMarket();

        emit ParentMarketDeployed(sessionId, deployer, parentAddress, parentOutcomeCount);

        childMarkets = new address[](parentOutcomeCount);
        for (uint256 parentOutcomeIndex = 0; parentOutcomeIndex < parentOutcomeCount; parentOutcomeIndex++) {
            childMarkets[parentOutcomeIndex] = _deployChildScalarForSession(
                params.children[parentOutcomeIndex], parentAddress, sessionId, parentOutcomeIndex
            );
        }

        uint64 t = uint64(block.timestamp);
        sessions[sessionId] = Session({
            deployer: deployer,
            parentMarket: parentAddress,
            childMarkets: childMarkets,
            openedAt: t,
            completedAt: t,
            expectedChildCount: parentOutcomeCount
        });
        sessionCount = sessionId + 1;
    }

    /// @notice Deploys the parent only; pass full `children` so it is validated. The same `msg.sender` must later call `deploySessionChildBatch` with matching configs.
    /// @param params Parent configuration and one `ChildScalarConfig` per outcome
    /// @return sessionId Monotonic id for this open session.
    /// @return parentAddress Seer categorical `Market` clone.
    function openPhasedFutarchySession(DeployFutarchySessionParams calldata params)
        external
        returns (uint256 sessionId, address parentAddress)
    {
        _validateParentAndChildren(params.parent, params.children);
        sessionId = sessionCount;
        address deployer = msg.sender;

        parentAddress = _seerCreateCategoricalParent(params.parent);
        if (parentAddress == address(0)) revert ZeroSeerMarket();
        
        uint256 outcomeCount = params.parent.outcomes.length;

        emit ParentMarketDeployed(sessionId, deployer, parentAddress, outcomeCount);
        emit PhasedSessionChildConfigPublished(sessionId, params.children);

        sessions[sessionId] = Session({
            deployer: deployer,
            parentMarket: parentAddress,
            childMarkets: new address[](0),
            openedAt: uint64(block.timestamp),
            completedAt: 0,
            expectedChildCount: outcomeCount
        });
        sessionCount = sessionId + 1;
    }

    /// @notice Appends the next child scalar markets in order. Callable only by the `deployer` of that `sessionId`. Splits work across blocks by choosing `childBatch` size per transaction.
    /// @param sessionId Session Identifier for which the children markets are being deployed.
    /// @param childBatch Config rows for a contiguous run starting at the current `childMarkets.length`; each `parentOutcomeIndex` must match its global index.
    function deploySessionChildBatch(uint256 sessionId, ChildScalarConfig[] calldata childBatch)
        external
        onlySessionDeployer(sessionId)
    {
        Session storage session = sessions[sessionId];
        if (session.completedAt != 0) revert SessionAlreadyComplete();

        uint256 start = session.childMarkets.length;
        uint256 batchSize = childBatch.length;

        if (batchSize == 0) revert InvalidConfig();

        if (start + batchSize > session.expectedChildCount) revert ChildBatchExceedsExpected();

        address parent = session.parentMarket;

        for (uint256 i = 0; i < batchSize; i++) {
            uint256 globalIndex = start + i;

            ChildScalarConfig calldata childConfig = childBatch[i];
            if (childConfig.parentOutcomeIndex != globalIndex) revert InvalidConfig();
            if (childConfig.lowerBound >= childConfig.upperBound || childConfig.upperBound >= type(uint256).max - 2) {
                revert InvalidConfig();
            }

            address childAddress = _deployChildScalarForSession(childConfig, parent, sessionId, globalIndex);
            session.childMarkets.push(childAddress);
        }

        if (session.childMarkets.length == session.expectedChildCount) {
            // marking session as completed
            session.completedAt = uint64(block.timestamp);
        }
    }

    // ************************************* //
    // *           Public Views            * //
    // ************************************* //

    /// @notice Returns the stored `Session` struct for a given id.
    /// @param sessionId Monotonic id assigned at deployment time.
    /// @return session Same fields as the `sessions` public mapping getter, grouped as a struct.
    function getSession(uint256 sessionId) external view returns (Session memory session) {
        session = sessions[sessionId];
    }

    // ************************************* //
    // *            Internal               * //
    // ************************************* //

    function _validateParentAndChildren(
        ParentCategoricalConfig calldata parentConfig,
        ChildScalarConfig[] calldata childConfigs
    ) private pure {

        uint256 parentOutcomeCount = parentConfig.outcomes.length;
        if (childConfigs.length != parentOutcomeCount ||  parentConfig.tokenNames.length != parentOutcomeCount + 1) {
            revert InvalidConfig();
        }

        for (uint256 parentOutcomeIndex = 0; parentOutcomeIndex < parentOutcomeCount; parentOutcomeIndex++) {
            if (childConfigs[parentOutcomeIndex].parentOutcomeIndex != parentOutcomeIndex) revert InvalidConfig();
            if (
                childConfigs[parentOutcomeIndex].lowerBound >= childConfigs[parentOutcomeIndex].upperBound
                    || childConfigs[parentOutcomeIndex].upperBound >= type(uint256).max - 2
            ) {
                revert InvalidConfig();
            }
        }
    }

    /// @dev `questionStart` / `questionEnd` / `outcomeType` are empty: Seer’s `createCategoricalMarket` path ignores them; only `marketName`, `outcomes`, `category`, `lang`, and token list drive the parent.
    function _seerCreateCategoricalParent(ParentCategoricalConfig calldata parentConfig) private returns (address parentAddress) {
        ISeerMarketFactory.CreateMarketParams memory createParams = ISeerMarketFactory.CreateMarketParams({
            marketName: parentConfig.marketName,
            outcomes: parentConfig.outcomes,
            questionStart: "",
            questionEnd: "",
            outcomeType: "",
            parentOutcome: 0,
            parentMarket: address(0),
            category: parentConfig.category,
            lang: parentConfig.lang,
            lowerBound: 0,
            upperBound: 0,
            minBond: parentConfig.minBond,
            openingTime: parentConfig.openingTime,
            tokenNames: parentConfig.tokenNames
        });
        parentAddress = seerMarketFactory.createCategoricalMarket(createParams);
    }

    /// @notice Deploys one scalar child for `parentOutcomeIndex`, returns the clone address.
    function _deployChildScalarForSession(
        ChildScalarConfig calldata childConfig,
        address parentAddress,
        uint256 sessionId,
        uint256 parentOutcomeIndex
    ) private returns (address childAddress) {

        string[] memory outcomeLabels = _buildScalarOutcomeLabels(childConfig);
        string[] memory wrappedTokenNames = _buildScalarWrappedTokenNames(childConfig);

        ISeerMarketFactory.CreateMarketParams memory createParams = ISeerMarketFactory.CreateMarketParams({
            marketName: childConfig.marketName,
            outcomes: outcomeLabels,
            questionStart: "",
            questionEnd: "",
            outcomeType: "",
            parentOutcome: childConfig.parentOutcomeIndex,
            parentMarket: parentAddress,
            category: childConfig.category,
            lang: childConfig.lang,
            lowerBound: childConfig.lowerBound,
            upperBound: childConfig.upperBound,
            minBond: childConfig.minBond,
            openingTime: childConfig.openingTime,
            tokenNames: wrappedTokenNames
        });
        childAddress = seerMarketFactory.createScalarMarket(createParams);

        if (childAddress == address(0)) revert ZeroSeerMarket();
        emit ChildMarketDeployed({
            sessionId: sessionId,
            parentOutcomeIndex: parentOutcomeIndex,
            childMarket: childAddress,
            parentMarket: parentAddress
        });
    }

    /// @notice Builds the two-branch `outcomes` array for Seer’s scalar template.
    function _buildScalarOutcomeLabels(ChildScalarConfig calldata childConfig) internal pure returns (string[] memory outcomeLabels) {
        outcomeLabels = new string[](SCALAR_BRANCH_OUTCOME_COUNT);
        outcomeLabels[0] = childConfig.outcomeLabelLow;
        outcomeLabels[1] = childConfig.outcomeLabelHigh;
    }

    function _buildScalarWrappedTokenNames(ChildScalarConfig calldata childConfig) internal pure returns (string[] memory wrappedTokenNames) {
        wrappedTokenNames = new string[](SEER_WRAPPED_TOKEN_NAME_SLOTS);
        wrappedTokenNames[0] = childConfig.tokenNameLow;
        wrappedTokenNames[1] = childConfig.tokenNameHigh;
        wrappedTokenNames[2] = ""; // Market factory enforces to SEER_INVALID always, so passing an empty string here
    }


    // ************************************* //
    // *              Errors               * //
    // ************************************* //

    error InvalidConfig();
    error ZeroSeerMarket();
    error NotSessionDeployer();
    error InvalidSession();
    error SessionAlreadyComplete();
    error ChildBatchExceedsExpected();
}
