import React, { useState } from "react";
import { ethers } from "ethers";

const AdminPanel = ({ contract, account, provider }) => {
    // State variables to store form inputs
    const [candidateName, setCandidateName] = useState("");
    const [voterAddress, setVoterAddress] = useState("");
    const [statusMessage, setStatusMessage] = useState(""); // For user notifications

    /**
     * Helper function to get the contract with the currently connected account as signer.
     * Ensures MetaMask and account are connected before interacting with the blockchain.
     */
    const getContractWithSigner = async () => {
        if (typeof window.ethereum === "undefined") {
            setStatusMessage("❌ MetaMask not detected. Please install it.");
            return null;
        }
    
        if (!account) {
            setStatusMessage("❌ No account connected. Please connect your wallet.");
            return null;
        }
    
        try {
            const providerInstance = new ethers.BrowserProvider(window.ethereum); // ✅ Ensure provider is created correctly
            const signer = await providerInstance.getSigner();
            return contract.connect(signer);
        } catch (error) {
            console.error("❌ Error getting signer:", error);
            setStatusMessage("❌ Error accessing wallet. Please reconnect.");
            return null;
        }
    };


    /**
     * Adds a new candidate to the election.
     * Only the owner can perform this action.
     */
    const addCandidate = async () => {
        const contractWithSigner = await getContractWithSigner();
        if (!contractWithSigner) return;

        try {
            setStatusMessage("📡 Adding candidate...");
            const tx = await contractWithSigner.addCandidate(candidateName);
            await tx.wait();
            setStatusMessage("✅ Candidate added successfully!");
            setCandidateName(""); // Clear input after success
        } catch (error) {
            console.error("❌ Error adding candidate:", error);
            setStatusMessage("❌ You are not authorized to add a candidate!");
        }
    };

    /**
     * Registers a new voter in the election.
     * Only the owner can perform this action.
     */
    const registerVoter = async () => {
        const contractWithSigner = await getContractWithSigner();
        if (!contractWithSigner) return;

        try {
            setStatusMessage("📡 Registering voter...");
            const tx = await contractWithSigner.registerVoter(voterAddress);
            await tx.wait();
            setStatusMessage("✅ Voter registered successfully!");
            setVoterAddress(""); // Clear input after success
        } catch (error) {
            console.error("❌ Error registering voter:", error);
            setStatusMessage("❌ You are not authorized to register voters!");
        }
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>

            {/* Section to add a candidate */}
            <div className="section">
                <h3>Add Candidate</h3>
                <input
                    type="text"
                    placeholder="Enter Candidate Name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                />
                <button onClick={addCandidate}>Add Candidate</button>
            </div>

            {/* Section to register a voter */}
            <div className="section">
                <h3>Register Voters</h3>
                <input
                    type="text"
                    placeholder="Enter Voter Address"
                    value={voterAddress}
                    onChange={(e) => setVoterAddress(e.target.value)}
                />
                <button onClick={registerVoter}>Register Voter</button>
            </div>

            {/* Status message for user feedback */}
            <div className="status-message">
                <h3>Status:</h3>
                <p>{statusMessage}</p>
            </div>
        </div>
    );
};

export default AdminPanel;

// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";

// const AdminPanel = ({ contract, account, provider }) => {
//     const [candidateName, setCandidateName] = useState("");
//     const [voterAddress, setVoterAddress] = useState("");
//     const [votingLive, setVotingLive] = useState(false);
//     const [statusMessage, setStatusMessage] = useState("");

//     // Fetch voting status from the contract
//     useEffect(() => {
//         const fetchVotingStatus = async () => {
//             if (!contract) return;
//             try {
//                 const isLive = await contract.votingOpen();
//                 setVotingLive(isLive);
//             } catch (error) {
//                 console.error("❌ Error fetching voting status:", error);
//             }
//         };

//         fetchVotingStatus();

//         // Listen for contract events
//         contract?.on("VotingStarted", () => setVotingLive(true));
//         contract?.on("VotingEnded", () => setVotingLive(false));

//         return () => {
//             contract?.off("VotingStarted");
//             contract?.off("VotingEnded");
//         };
//     }, [contract]);

//     // Ensure we have the correct signer
//     const getContractWithSigner = async () => {
//         if (!provider) {
//             setStatusMessage("❌ MetaMask not detected. Please install it.");
//             return null;
//         }

//         if (!account) {
//             setStatusMessage("❌ No account connected. Please connect your wallet.");
//             return null;
//         }

//         try {
//             const signer = await provider.getSigner(); // ✅ Fix: Do not pass account, MetaMask handles it
//             return contract.connect(signer);
//         } catch (error) {
//             console.error("❌ Error getting signer:", error);
//             setStatusMessage("❌ Error accessing wallet. Please reconnect.");
//             return null;
//         }
//     };

//     const addCandidate = async () => {
//         const contractWithSigner = await getContractWithSigner();
//         if (!contractWithSigner) return;
//         try {
//             setStatusMessage("📡 Adding candidate...");
//             const tx = await contractWithSigner.addCandidate(candidateName);
//             await tx.wait();
//             setStatusMessage("✅ Candidate added successfully!");
//             setCandidateName(""); // Clear input
//         } catch (error) {
//             console.error("❌ Error adding candidate:", error);
//             setStatusMessage("❌ You are not authorized to add a candidate!");
//         }
//     };

//     const registerVoter = async () => {
//         const contractWithSigner = await getContractWithSigner();
//         if (!contractWithSigner) return;
//         try {
//             setStatusMessage("📡 Registering voter...");
//             const tx = await contractWithSigner.registerVoter(voterAddress);
//             await tx.wait();
//             setStatusMessage("✅ Voter registered successfully!");
//             setVoterAddress(""); // Clear input
//         } catch (error) {
//             console.error("❌ Error registering voter:", error);
//             setStatusMessage("❌ You are not authorized to register voters!");
//         }
//     };

//     const startVoting = async () => {
//         const contractWithSigner = await getContractWithSigner();
//         if (!contractWithSigner) return;
//         try {
//             setStatusMessage("📡 Starting voting...");
//             const tx = await contractWithSigner.startVoting();
//             await tx.wait();
//             setVotingLive(true);
//             setStatusMessage("🟢 Voting session started!");
//         } catch (error) {
//             console.error("❌ Error starting voting:", error);
//             setStatusMessage("❌ You are not authorized to start voting!");
//         }
//     };

//     const endVoting = async () => {
//         const contractWithSigner = await getContractWithSigner();
//         if (!contractWithSigner) return;
//         try {
//             setStatusMessage("📡 Ending voting...");
//             const tx = await contractWithSigner.endVoting();
//             await tx.wait();
//             setVotingLive(false);
//             setStatusMessage("🔴 Voting session ended!");
//         } catch (error) {
//             console.error("❌ Error ending voting:", error);
//             setStatusMessage("❌ You are not authorized to end voting!");
//         }
//     };

//     return (
//         <div className="admin-panel">
//             <h2>Admin Panel</h2>

//             <div className="section">
//                 <h3>Add Candidate</h3>
//                 <input
//                     type="text"
//                     placeholder="Enter Candidate Name"
//                     value={candidateName}
//                     onChange={(e) => setCandidateName(e.target.value)}
//                 />
//                 <button onClick={addCandidate}>Add Candidate</button>
//             </div>

//             <div className="section">
//                 <h3>Register Voters</h3>
//                 <input
//                     type="text"
//                     placeholder="Enter Voter Address"
//                     value={voterAddress}
//                     onChange={(e) => setVoterAddress(e.target.value)}
//                 />
//                 <button onClick={registerVoter}>Register Voter</button>
//             </div>

//             <div className="section">
//                 <h3>Control Voting</h3>
//                 <button onClick={startVoting} disabled={votingLive}>Start Voting</button>
//                 <button onClick={endVoting} disabled={!votingLive}>End Voting</button>
//             </div>

//             <div className="status-message">
//                 <h3>Status:</h3>
//                 <p>{votingLive ? "🟢 Voting is Live" : "🔴 Voting is Not Live"}</p>
//                 <p>{statusMessage}</p>
//             </div>
//         </div>
//     );
// };

// export default AdminPanel;