// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol"; // Foundry's test framework
import "../src/Voting.sol";   // Import the Voting contract

contract VotingTest is Test {
    Voting public votingContract;
    address public owner;
    address public voter1;
    address public voter2;
    address public voter3;

    function setUp() public {
        // Assign test addresses
        owner = address(this);  // Test contract acts as the owner
        voter1 = vm.addr(1);
        voter2 = vm.addr(2);
        voter3 = vm.addr(3);

        // Deploy the contract before each test
        votingContract = new Voting();

        // Add candidates
        votingContract.addCandidate("Alice");
        votingContract.addCandidate("Bob");

        // Register voters
        votingContract.registerVoter(voter1);
        votingContract.registerVoter(voter2);
    }

    function testCandidateAddition() public {
        // Verify candidates were added
        (string memory name1, ) = votingContract.candidates(0);
        (string memory name2, ) = votingContract.candidates(1);

        assertEq(name1, "Alice", "First candidate should be Alice");
        assertEq(name2, "Bob", "Second candidate should be Bob");
    }

    function testPreventDuplicateCandidates() public {
        // Attempt to add duplicate candidate
        vm.expectRevert(bytes("Candidate already exists"));
        votingContract.addCandidate("Alice");
    }

    function testVoterRegistration() public {
        // Check if voter1 is registered
        assertTrue(votingContract.registeredVoters(voter1), "Voter1 should be registered");

        // Check if unregistered voter3 is NOT registered
        assertFalse(votingContract.registeredVoters(voter3), "Voter3 should NOT be registered");
    }

    function testVotingProcess() public {
        // Cast votes
        vm.prank(voter1); // Simulate voter1 sending the transaction
        votingContract.vote(0, "CID_Voter1");

        vm.prank(voter2);
        votingContract.vote(1, "CID_Voter2");

        // Check vote counts
        assertEq(votingContract.getCandidateVoteCount(0), 1, "Alice should have 1 vote");
        assertEq(votingContract.getCandidateVoteCount(1), 1, "Bob should have 1 vote");
    }

    function testPreventMultipleVotes() public {
        // Voter1 votes once
        vm.prank(voter1);
        votingContract.vote(0, "CID_Voter1");

        // Attempt double voting
        vm.prank(voter1);
        vm.expectRevert(bytes("You have already voted"));
        votingContract.vote(1, "CID_Voter1");
    }

    function testOnlyRegisteredVotersCanVote() public {
        // Unregistered voter3 tries to vote
        vm.prank(voter3);
        vm.expectRevert(bytes("Not a registered voter"));
        votingContract.vote(0, "CID_Voter3");
    }

    function testVoteStorageOnChain() public {
        // Voter1 votes
        vm.prank(voter1);
        votingContract.vote(0, "CID_Voter1");

        // Retrieve vote CID from contract
        string memory storedCID = votingContract.getVoteCID(0);
        assertEq(storedCID, "CID_Voter1", "Vote CID should be stored correctly");
    }

    function testGetCurrentLeader() public {
        // Voter1 votes for Alice
        vm.prank(voter1);
        votingContract.vote(0, "CID_Voter1");

        // Check leader
        (string[] memory leaders, uint votes) = votingContract.getCurrentLeader();
        assertEq(leaders[0], "Alice", "Alice should be the current leader");
        assertEq(votes, 1, "Leader should have 1 vote");

        // Voter2 votes for Bob (tie)
        vm.prank(voter2);
        votingContract.vote(1, "CID_Voter2");

        // Check for tie
        (string[] memory tiedLeaders, uint tiedVotes) = votingContract.getCurrentLeader();
        assertEq(tiedLeaders.length, 2, "There should be 2 tied leaders");
        assertEq(tiedVotes, 1, "Both should have 1 vote");
    }

    // Fuzz test: Randomized voting process
    function testFuzzVoting(uint256 candidateIndex) public {
        // Ensure candidateIndex is within bounds
        vm.assume(candidateIndex < 2);

        // Simulate random voter
        address randomVoter = vm.addr(candidateIndex + 10); // Unique address
        votingContract.registerVoter(randomVoter);

        // Vote
        vm.prank(randomVoter);
        votingContract.vote(candidateIndex, "CID_Fuzz");

        // Check vote count
        uint expectedVoteCount = votingContract.getCandidateVoteCount(candidateIndex);
        assertEq(expectedVoteCount, 1, "Candidate should have received a vote");
    }
}