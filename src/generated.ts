import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GnosisRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const gnosisRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_conditionalTokens',
        internalType: 'contract IConditionalTokens',
        type: 'address',
      },
      {
        name: '_wrapped1155Factory',
        internalType: 'contract IWrapped1155Factory',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'conditionalTokens',
    outputs: [
      {
        name: '',
        internalType: 'contract IConditionalTokens',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'collateralToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: 'parentCollectionId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'conditionId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'indexSet', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getTokenId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'conditionId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getWinningOutcomes',
    outputs: [{ name: '', internalType: 'bool[]', type: 'bool[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'collateralToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: 'market', internalType: 'contract Market', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mergePositions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'market', internalType: 'contract Market', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mergeToBase',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'collateralToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: 'market', internalType: 'contract Market', type: 'address' },
      { name: 'outcomeIndexes', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'redeemPositions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'market', internalType: 'contract Market', type: 'address' },
      { name: 'outcomeIndexes', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'redeemToBase',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sDAI',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'savingsXDaiAdapter',
    outputs: [
      {
        name: '',
        internalType: 'contract ISavingsXDaiAdapter',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'market', internalType: 'contract Market', type: 'address' },
    ],
    name: 'splitFromBase',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'collateralToken',
        internalType: 'contract IERC20',
        type: 'address',
      },
      { name: 'market', internalType: 'contract Market', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'splitPosition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'wrapped1155Factory',
    outputs: [
      {
        name: '',
        internalType: 'contract IWrapped1155Factory',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
] as const

export const gnosisRouterAddress =
  '0xeC9048b59b3467415b1a38F63416407eA0c70fB8' as const

export const gnosisRouterConfig = {
  address: gnosisRouterAddress,
  abi: gnosisRouterAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sDAI
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sDaiAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_ticker', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'currentAllowance', internalType: 'uint256', type: 'uint256' },
      { name: 'requestedDecrease', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20FailedDecreaseAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'deadline', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC2612ExpiredSignature',
  },
  {
    type: 'error',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC2612InvalidSigner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC4626ExceededMaxDeposit',
  },
  {
    type: 'error',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC4626ExceededMaxMint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC4626ExceededMaxRedeem',
  },
  {
    type: 'error',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC4626ExceededMaxWithdraw',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  { type: 'error', inputs: [], name: 'MathOverflowedMulDiv' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'assets',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'shares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Deposit',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'receiver',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'assets',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'shares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdraw',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'convertToAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'convertToShares',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'requestedDecrease', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deploymentChainId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'deposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'maxDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'maxMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'maxRedeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'maxWithdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'previewDeposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'previewMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'shares', internalType: 'uint256', type: 'uint256' }],
    name: 'previewRedeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'assets', internalType: 'uint256', type: 'uint256' }],
    name: 'previewWithdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'redeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'wxdai',
    outputs: [{ name: '', internalType: 'contract IWXDAI', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

export const sDaiAddress = '0xaf204776c7245bF4147c2612BF6e5972Ee483701' as const

export const sDaiConfig = { address: sDaiAddress, abi: sDaiAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sDAIAdapter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sDaiAdapterAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'interestReceiver_', internalType: 'address', type: 'address' },
      { name: 'sDAI_', internalType: 'address payable', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'deposit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'depositXDAI',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'interestReceiver',
    outputs: [
      {
        name: '',
        internalType: 'contract IBridgeInterestReceiver',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'redeem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'redeemAll',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'redeemAllXDAI',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'shares', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'redeemXDAI',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sDAI',
    outputs: [
      { name: '', internalType: 'contract SavingsXDai', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vaultAPY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'assets', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawXDAI',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'wxdai',
    outputs: [{ name: '', internalType: 'contract IWXDAI', type: 'address' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

export const sDaiAdapterAddress =
  '0xD499b51fcFc66bd31248ef4b28d656d67E591A94' as const

export const sDaiAdapterConfig = {
  address: sDaiAdapterAddress,
  abi: sDaiAdapterAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gnosisRouterAbi}__
 */
export const useReadGnosisRouter = /*#__PURE__*/ createUseReadContract({
  abi: gnosisRouterAbi,
  address: gnosisRouterAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"conditionalTokens"`
 */
export const useReadGnosisRouterConditionalTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'conditionalTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"getTokenId"`
 */
export const useReadGnosisRouterGetTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'getTokenId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"getWinningOutcomes"`
 */
export const useReadGnosisRouterGetWinningOutcomes =
  /*#__PURE__*/ createUseReadContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'getWinningOutcomes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"sDAI"`
 */
export const useReadGnosisRouterSDai = /*#__PURE__*/ createUseReadContract({
  abi: gnosisRouterAbi,
  address: gnosisRouterAddress,
  functionName: 'sDAI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"savingsXDaiAdapter"`
 */
export const useReadGnosisRouterSavingsXDaiAdapter =
  /*#__PURE__*/ createUseReadContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'savingsXDaiAdapter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadGnosisRouterSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"wrapped1155Factory"`
 */
export const useReadGnosisRouterWrapped1155Factory =
  /*#__PURE__*/ createUseReadContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'wrapped1155Factory',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gnosisRouterAbi}__
 */
export const useWriteGnosisRouter = /*#__PURE__*/ createUseWriteContract({
  abi: gnosisRouterAbi,
  address: gnosisRouterAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"mergePositions"`
 */
export const useWriteGnosisRouterMergePositions =
  /*#__PURE__*/ createUseWriteContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'mergePositions',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"mergeToBase"`
 */
export const useWriteGnosisRouterMergeToBase =
  /*#__PURE__*/ createUseWriteContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'mergeToBase',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useWriteGnosisRouterOnErc1155BatchReceived =
  /*#__PURE__*/ createUseWriteContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useWriteGnosisRouterOnErc1155Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"redeemPositions"`
 */
export const useWriteGnosisRouterRedeemPositions =
  /*#__PURE__*/ createUseWriteContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'redeemPositions',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"redeemToBase"`
 */
export const useWriteGnosisRouterRedeemToBase =
  /*#__PURE__*/ createUseWriteContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'redeemToBase',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"splitFromBase"`
 */
export const useWriteGnosisRouterSplitFromBase =
  /*#__PURE__*/ createUseWriteContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'splitFromBase',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"splitPosition"`
 */
export const useWriteGnosisRouterSplitPosition =
  /*#__PURE__*/ createUseWriteContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'splitPosition',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gnosisRouterAbi}__
 */
export const useSimulateGnosisRouter = /*#__PURE__*/ createUseSimulateContract({
  abi: gnosisRouterAbi,
  address: gnosisRouterAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"mergePositions"`
 */
export const useSimulateGnosisRouterMergePositions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'mergePositions',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"mergeToBase"`
 */
export const useSimulateGnosisRouterMergeToBase =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'mergeToBase',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useSimulateGnosisRouterOnErc1155BatchReceived =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useSimulateGnosisRouterOnErc1155Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"redeemPositions"`
 */
export const useSimulateGnosisRouterRedeemPositions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'redeemPositions',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"redeemToBase"`
 */
export const useSimulateGnosisRouterRedeemToBase =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'redeemToBase',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"splitFromBase"`
 */
export const useSimulateGnosisRouterSplitFromBase =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'splitFromBase',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gnosisRouterAbi}__ and `functionName` set to `"splitPosition"`
 */
export const useSimulateGnosisRouterSplitPosition =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gnosisRouterAbi,
    address: gnosisRouterAddress,
    functionName: 'splitPosition',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__
 */
export const useReadSDai = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadSDaiDomainSeparator = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'DOMAIN_SEPARATOR',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"PERMIT_TYPEHASH"`
 */
export const useReadSDaiPermitTypehash = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'PERMIT_TYPEHASH',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"VERSION"`
 */
export const useReadSDaiVersion = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'VERSION',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadSDaiAllowance = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"asset"`
 */
export const useReadSDaiAsset = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'asset',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadSDaiBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"convertToAssets"`
 */
export const useReadSDaiConvertToAssets = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'convertToAssets',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"convertToShares"`
 */
export const useReadSDaiConvertToShares = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'convertToShares',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadSDaiDecimals = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"deploymentChainId"`
 */
export const useReadSDaiDeploymentChainId = /*#__PURE__*/ createUseReadContract(
  { abi: sDaiAbi, address: sDaiAddress, functionName: 'deploymentChainId' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useReadSDaiEip712Domain = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'eip712Domain',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"maxDeposit"`
 */
export const useReadSDaiMaxDeposit = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'maxDeposit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"maxMint"`
 */
export const useReadSDaiMaxMint = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'maxMint',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"maxRedeem"`
 */
export const useReadSDaiMaxRedeem = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'maxRedeem',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"maxWithdraw"`
 */
export const useReadSDaiMaxWithdraw = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'maxWithdraw',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"name"`
 */
export const useReadSDaiName = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"nonces"`
 */
export const useReadSDaiNonces = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"previewDeposit"`
 */
export const useReadSDaiPreviewDeposit = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'previewDeposit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"previewMint"`
 */
export const useReadSDaiPreviewMint = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'previewMint',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"previewRedeem"`
 */
export const useReadSDaiPreviewRedeem = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'previewRedeem',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"previewWithdraw"`
 */
export const useReadSDaiPreviewWithdraw = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'previewWithdraw',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadSDaiSymbol = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"totalAssets"`
 */
export const useReadSDaiTotalAssets = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'totalAssets',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadSDaiTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"wxdai"`
 */
export const useReadSDaiWxdai = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'wxdai',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__
 */
export const useWriteSDai = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAbi,
  address: sDaiAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteSDaiApprove = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useWriteSDaiDecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: sDaiAbi,
    address: sDaiAddress,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteSDaiDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useWriteSDaiIncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: sDaiAbi,
    address: sDaiAddress,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteSDaiMint = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"permit"`
 */
export const useWriteSDaiPermit = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'permit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"redeem"`
 */
export const useWriteSDaiRedeem = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'redeem',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteSDaiTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteSDaiTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteSDaiWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__
 */
export const useSimulateSDai = /*#__PURE__*/ createUseSimulateContract({
  abi: sDaiAbi,
  address: sDaiAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateSDaiApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useSimulateSDaiDecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAbi,
    address: sDaiAddress,
    functionName: 'decreaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateSDaiDeposit = /*#__PURE__*/ createUseSimulateContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useSimulateSDaiIncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAbi,
    address: sDaiAddress,
    functionName: 'increaseAllowance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateSDaiMint = /*#__PURE__*/ createUseSimulateContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"permit"`
 */
export const useSimulateSDaiPermit = /*#__PURE__*/ createUseSimulateContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'permit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"redeem"`
 */
export const useSimulateSDaiRedeem = /*#__PURE__*/ createUseSimulateContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'redeem',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateSDaiTransfer = /*#__PURE__*/ createUseSimulateContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateSDaiTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAbi,
    address: sDaiAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateSDaiWithdraw = /*#__PURE__*/ createUseSimulateContract({
  abi: sDaiAbi,
  address: sDaiAddress,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sDaiAbi}__
 */
export const useWatchSDaiEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: sDaiAbi,
  address: sDaiAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sDaiAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchSDaiApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sDaiAbi,
    address: sDaiAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sDaiAbi}__ and `eventName` set to `"Deposit"`
 */
export const useWatchSDaiDepositEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sDaiAbi,
    address: sDaiAddress,
    eventName: 'Deposit',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sDaiAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useWatchSDaiEip712DomainChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sDaiAbi,
    address: sDaiAddress,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sDaiAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchSDaiTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sDaiAbi,
    address: sDaiAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sDaiAbi}__ and `eventName` set to `"Withdraw"`
 */
export const useWatchSDaiWithdrawEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sDaiAbi,
    address: sDaiAddress,
    eventName: 'Withdraw',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAdapterAbi}__
 */
export const useReadSDaiAdapter = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAdapterAbi,
  address: sDaiAdapterAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"interestReceiver"`
 */
export const useReadSDaiAdapterInterestReceiver =
  /*#__PURE__*/ createUseReadContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'interestReceiver',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"sDAI"`
 */
export const useReadSDaiAdapterSDai = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAdapterAbi,
  address: sDaiAdapterAddress,
  functionName: 'sDAI',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"vaultAPY"`
 */
export const useReadSDaiAdapterVaultApy = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAdapterAbi,
  address: sDaiAdapterAddress,
  functionName: 'vaultAPY',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"wxdai"`
 */
export const useReadSDaiAdapterWxdai = /*#__PURE__*/ createUseReadContract({
  abi: sDaiAdapterAbi,
  address: sDaiAdapterAddress,
  functionName: 'wxdai',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__
 */
export const useWriteSDaiAdapter = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAdapterAbi,
  address: sDaiAdapterAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteSDaiAdapterDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAdapterAbi,
  address: sDaiAdapterAddress,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"depositXDAI"`
 */
export const useWriteSDaiAdapterDepositXdai =
  /*#__PURE__*/ createUseWriteContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'depositXDAI',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteSDaiAdapterMint = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAdapterAbi,
  address: sDaiAdapterAddress,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"redeem"`
 */
export const useWriteSDaiAdapterRedeem = /*#__PURE__*/ createUseWriteContract({
  abi: sDaiAdapterAbi,
  address: sDaiAdapterAddress,
  functionName: 'redeem',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"redeemAll"`
 */
export const useWriteSDaiAdapterRedeemAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'redeemAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"redeemAllXDAI"`
 */
export const useWriteSDaiAdapterRedeemAllXdai =
  /*#__PURE__*/ createUseWriteContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'redeemAllXDAI',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"redeemXDAI"`
 */
export const useWriteSDaiAdapterRedeemXdai =
  /*#__PURE__*/ createUseWriteContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'redeemXDAI',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteSDaiAdapterWithdraw = /*#__PURE__*/ createUseWriteContract(
  {
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'withdraw',
  },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"withdrawXDAI"`
 */
export const useWriteSDaiAdapterWithdrawXdai =
  /*#__PURE__*/ createUseWriteContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'withdrawXDAI',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__
 */
export const useSimulateSDaiAdapter = /*#__PURE__*/ createUseSimulateContract({
  abi: sDaiAdapterAbi,
  address: sDaiAdapterAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateSDaiAdapterDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"depositXDAI"`
 */
export const useSimulateSDaiAdapterDepositXdai =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'depositXDAI',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateSDaiAdapterMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"redeem"`
 */
export const useSimulateSDaiAdapterRedeem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'redeem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"redeemAll"`
 */
export const useSimulateSDaiAdapterRedeemAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'redeemAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"redeemAllXDAI"`
 */
export const useSimulateSDaiAdapterRedeemAllXdai =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'redeemAllXDAI',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"redeemXDAI"`
 */
export const useSimulateSDaiAdapterRedeemXdai =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'redeemXDAI',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateSDaiAdapterWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sDaiAdapterAbi}__ and `functionName` set to `"withdrawXDAI"`
 */
export const useSimulateSDaiAdapterWithdrawXdai =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sDaiAdapterAbi,
    address: sDaiAdapterAddress,
    functionName: 'withdrawXDAI',
  })
