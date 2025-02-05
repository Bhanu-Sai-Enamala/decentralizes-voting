// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    
    // Struct to store candidate details
    struct Candidate {
        string name;  // Candidate's name
        uint voteCount;  // Number of votes received
    }

    address public owner;  // Address of the contract owner (admin)

    Candidate[] public candidates;  // Dynamic array to store the list of candidates

    mapping(address => bool) public hasVoted;  // Tracks whether an address has voted
    mapping(address => bool) public registeredVoters;  // Stores addresses of registered voters
    mapping(uint => string) public voteCIDs;  // Maps vote index to an IPFS CID storing vote details
    mapping(string => bool) private candidateExists;  // Prevents duplicate candidates

    uint public voteCount;  // Keeps track of total votes cast

    // Events to notify when important actions happen
    event CandidateAdded(string name);
    event Voted(address indexed voter, uint candidateIndex);
    event VoteStored(uint indexed voteIndex, string cid);

    // Ensures only the owner can call specific functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // Ensures only registered voters can vote
    modifier onlyRegistered() {
        require(registeredVoters[msg.sender], "Not a registered voter");
        _;
    }

    constructor() {
        owner = msg.sender;  // Set contract deployer as owner
    }

    // Function to add a candidate to the election (only the owner can do this)
    function addCandidate(string memory _name) public onlyOwner {
        require(!candidateExists[_name], "Candidate already exists");  // Ensure uniqueness

        candidates.push(Candidate(_name, 0));  // Add the new candidate
        candidateExists[_name] = true;  // Mark candidate as added

        emit CandidateAdded(_name);  // Emit event to log candidate addition
    }

    // Function to register voters (only the owner can register them)
    function registerVoter(address _voter) public onlyOwner {
        registeredVoters[_voter] = true;  // Mark the voter as registered
    }

    // Function that allows a registered voter to vote for a candidate
    function vote(uint _candidateIndex, string memory _cid) public onlyRegistered {
        require(!hasVoted[msg.sender], "You have already voted");  // Prevent double voting
        require(_candidateIndex < candidates.length, "Invalid candidate index");  // Ensure candidate index is valid

        candidates[_candidateIndex].voteCount++;  // Increase the vote count of the chosen candidate
        hasVoted[msg.sender] = true;  // Mark voter as having voted
        voteCIDs[voteCount] = _cid;  // Store vote details in IPFS
        voteCount++;  // Increment total votes

        emit Voted(msg.sender, _candidateIndex);  // Emit event for voting
        emit VoteStored(voteCount - 1, _cid);  // Emit event for storing vote record
    }

    // Function to return all candidates
    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    // Function to get the vote count of a specific candidate
    function getCandidateVoteCount(uint _candidateIndex) public view returns (uint) {
        require(_candidateIndex < candidates.length, "Invalid candidate index");  // Ensure valid candidate index
        return candidates[_candidateIndex].voteCount;
    }

    // Function to get the IPFS CID of a specific vote by index
    function getVoteCID(uint _voteIndex) public view returns (string memory) {
        require(_voteIndex < voteCount, "Invalid vote index");  // Ensure valid vote index
        return voteCIDs[_voteIndex];
    }

    // Function to determine the leading candidate(s) based on votes
    function getCurrentLeader() public view returns (string[] memory, uint) {
        require(candidates.length > 0, "No candidates available");  // Ensure there are candidates

        uint highestVoteCount = 0;
        uint totalVotes = 0;

        // Loop through all candidates to find the highest vote count
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > highestVoteCount) {
                highestVoteCount = candidates[i].voteCount;
            }
            totalVotes += candidates[i].voteCount;
        }

        require(totalVotes > 0, "No votes have been cast yet");  // Ensure at least one vote has been cast

        // Count how many candidates have the highest vote count
        uint leaderCount = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount == highestVoteCount) {
                leaderCount++;
            }
        }

        // Create an array to store names of the leading candidates
        string[] memory leaders = new string[](leaderCount);
        uint index = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount == highestVoteCount) {
                leaders[index] = candidates[i].name;
                index++;
            }
        }

        return (leaders, highestVoteCount);
    }
}