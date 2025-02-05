// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Voting.sol";

contract DeployVoting is Script {
    function run() external {
        // Fetch the private key from the environment variables.
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        // Begin broadcasting transactions using the private key.
        vm.startBroadcast(privateKey);
        
        // Deploy the Voting contract.
        Voting voting = new Voting();
        
        // Stop broadcasting transactions.
        vm.stopBroadcast();

        // Log the deployed contract address for reference.
        console.log("Voting contract deployed at:", address(voting));
    }
}