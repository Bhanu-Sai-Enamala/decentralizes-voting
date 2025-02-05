export const CONTRACT_ADDRESS = "0xBD30E5B7d492105743725E8ec0611a6b085D4190";


const CONTRACT_ABI = [{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"addCandidate","inputs":[{"name":"_name","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"candidates","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"name","type":"string","internalType":"string"},{"name":"voteCount","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getCandidateVoteCount","inputs":[{"name":"_candidateIndex","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getCandidates","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct Voting.Candidate[]","components":[{"name":"name","type":"string","internalType":"string"},{"name":"voteCount","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},{"type":"function","name":"getCurrentLeader","inputs":[],"outputs":[{"name":"","type":"string[]","internalType":"string[]"},{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getVoteCID","inputs":[{"name":"_voteIndex","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"hasVoted","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"registerVoter","inputs":[{"name":"_voter","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"registeredVoters","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"vote","inputs":[{"name":"_candidateIndex","type":"uint256","internalType":"uint256"},{"name":"_cid","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"voteCIDs","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"voteCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"event","name":"CandidateAdded","inputs":[{"name":"name","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"VoteStored","inputs":[{"name":"voteIndex","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"cid","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"Voted","inputs":[{"name":"voter","type":"address","indexed":true,"internalType":"address"},{"name":"candidateIndex","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false}];

export default CONTRACT_ABI;

export const STORACHA_KEYS = {
    agentDID: process.env.REACT_APP_DID_KEY,
    privateKey: process.env.REACT_APP_PRIVATE_KEY,
    spaceDID: process.env.REACT_APP_SPACE_DID,
    delegationProof: process.env.REACT_APP_DELEGATION_PROOF,
  };
