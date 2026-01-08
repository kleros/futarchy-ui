// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract CreateCall {
    /// @notice Emitted when a new contract is created
    event ContractCreation(address indexed newContract);

    /**
     * @notice Deploys a new contract using the create2 opcode.
     * @param value The value in wei to be sent with the contract creation.
     * @param deploymentData The initialisation code of the contract to be created.
     * @param salt The salt value to use for the contract creation.
     * @return newContract The address of the newly created contract.
     */
    function performCreate2(uint256 value, bytes memory deploymentData, bytes32 salt) public returns (address newContract) {

        assembly {
            newContract := create2(value, add(0x20, deploymentData), mload(deploymentData), salt)
        }
        require(newContract != address(0), "Could not deploy contract");
        emit ContractCreation(newContract);
    }
}