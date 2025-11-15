// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract TradeExecutor {
    struct Call {
        address to;
        bytes data;
    }

    struct ValueCall {
        address to;
        uint256 value;
        bytes data;
    }
    
    /// @dev Contract owner
    address public immutable owner;
    
    /// @dev Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    /// @dev Constructor.
    /// @param _owner Immutable owner of the contract.
    constructor(
        address _owner
    ) {
        owner = _owner;
    }
    
    /// @dev Execute calls in a single transaction. Only callable by owner.
    /// @param calls Array of calls to execute
    function batchExecute(Call[] calldata calls) external onlyOwner {
        for (uint i = 0; i < calls.length; i++) {
            (bool success,) = calls[i].to.call(calls[i].data);
            require(success, "Call failed");
        }
    }

    /// @dev Execute calls with value in a single transaction. Only callable by owner.
    /// @param calls Array of calls to execute
    function batchValueExecute(ValueCall[] calldata calls) external payable  onlyOwner {
        for (uint i = 0; i < calls.length; i++) {
            (bool success,) = calls[i].to.call{value: calls[i].value}(calls[i].data);
            require(success, "Call failed");
        }
    }

    /// @dev Receive ETH.
    receive() external payable { }
}