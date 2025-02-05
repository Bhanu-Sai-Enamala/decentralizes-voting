// import React, { useState, useEffect } from "react";
// import VotingForm from "./components/VotingForm";
// import CandidateList from "./components/CandidateList";
// import ResultDisplay from "./components/ResultDisplay";
// import AdminPanel from "./components/AdminPanel";
// import { ethers } from "ethers";
// import CONTRACT_ABI, { CONTRACT_ADDRESS } from "./config";
// import './App.css';

// const App = () => {
//     const [provider, setProvider] = useState(null);
//     const [contract, setContract] = useState(null);
//     const [account, setAccount] = useState(null);
//     const [votingOpen, setVotingOpen] = useState(false);
//     const [resultsData, setResultsData] = useState(null);

//     useEffect(() => {
//         const connectBlockchain = async () => {
//             if (!window.ethereum) {
//                 console.error("❌ MetaMask not detected. Please install it.");
//                 return;
//             }

//             try {
//                 const providerInstance = new ethers.BrowserProvider(window.ethereum);
//                 const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

//                 if (accounts.length === 0) {
//                     console.error("❌ No accounts found. Please connect your wallet.");
//                     return;
//                 }

//                 const signer = await providerInstance.getSigner();
//                 const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

//                 setProvider(providerInstance);
//                 setContract(contractInstance);
//                 setAccount(accounts[0]);

//                 // Fetch voting status
//                 const votingStatus = await contractInstance.votingOpen();
//                 setVotingOpen(votingStatus);

//                 // Fetch election results if voting has ended
//                 if (!votingStatus) {
//                     fetchElectionResults(contractInstance);
//                 }

//                 console.log("✅ Connected Account:", accounts[0]);
//             } catch (error) {
//                 console.error("❌ Error connecting to blockchain:", error);
//             }
//         };

//         connectBlockchain();

//         // Detect account change
//         window.ethereum?.on("accountsChanged", async (accounts) => {
//             if (accounts.length > 0) {
//                 console.log("🔄 MetaMask account changed:", accounts[0]);
//                 setAccount(accounts[0]);

//                 const providerInstance = new ethers.BrowserProvider(window.ethereum);
//                 const signer = await providerInstance.getSigner();
//                 const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

//                 setProvider(providerInstance);
//                 setContract(contractInstance);
//             } else {
//                 console.warn("⚠️ No accounts found. Please connect to MetaMask.");
//                 setAccount(null);
//                 setContract(null);
//             }
//         });

//         // Detect network change
//         window.ethereum?.on("chainChanged", () => {
//             console.warn("🔄 Network changed. Reloading...");
//             window.location.reload();
//         });

//         return () => {
//             window.ethereum?.removeListener("accountsChanged", connectBlockchain);
//             window.ethereum?.removeListener("chainChanged", () => window.location.reload());
//         };
//     }, []);

//     const fetchElectionResults = async (contractInstance) => {
//         try {
//             const [leaders, voteCount] = await contractInstance.getCurrentLeader();
//             setResultsData(leaders.length > 0 ? { leaders, voteCount } : null);
//         } catch (error) {
//             console.error("❌ Error fetching election results:", error);
//         }
//     };

//     return (
//         <div className="container">
//             <h1>🗳️ Decentralized Voting App</h1>
//             <p>Connected Account: <strong>{account || "Not Connected"}</strong></p>

//             {account && (
//                 <div className="section">
//                     <AdminPanel contract={contract} account={account} />
//                 </div>
//             )}

//             <div className="section">
//                 <VotingForm contract={contract} account={account} />
//             </div>

//             <div className="section">
//                 <CandidateList contract={contract} />
//             </div>

//             <div className="section">
//                 <ResultDisplay votingOpen={votingOpen} resultsData={resultsData} />
//             </div>
//         </div>
//     );
// };

// export default App;

import React, { useState, useEffect } from "react";
import VotingForm from "./components/VotingForm";
import CandidateList from "./components/CandidateList";
import AdminPanel from "./components/AdminPanel";
import ResultDisplay from"./components/ResultDisplay";
import { ethers } from "ethers";
import CONTRACT_ABI, { CONTRACT_ADDRESS } from "./config";
import './App.css';

const App = () => {
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [votingOpen, setVotingOpen] = useState(false);


    useEffect(() => {
        const connectBlockchain = async () => {
            if (!window.ethereum) {
                console.error("❌ MetaMask not detected. Please install it.");
                return;
            }

            try {
                const providerInstance = new ethers.BrowserProvider(window.ethereum);
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

                if (accounts.length === 0) {
                    console.error("❌ No accounts found. Please connect your wallet.");
                    return;
                }

                const signer = await providerInstance.getSigner();
                const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                setProvider(providerInstance);
                setContract(contractInstance);
                setAccount(accounts[0]);

                // Fetch voting status
                const votingStatus = await contractInstance.votingOpen();
                setVotingOpen(votingStatus);

                console.log("✅ Connected Account:", accounts[0]);
            } catch (error) {
                console.error("❌ Error connecting to blockchain:", error);
            }
        };

        connectBlockchain();

        // Detect account change
        window.ethereum?.on("accountsChanged", async (accounts) => {
            if (accounts.length > 0) {
                console.log("🔄 MetaMask account changed:", accounts[0]);
                setAccount(accounts[0]);

                const providerInstance = new ethers.BrowserProvider(window.ethereum);
                const signer = await providerInstance.getSigner();
                const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                setProvider(providerInstance);
                setContract(contractInstance);
            } else {
                console.warn("⚠️ No accounts found. Please connect to MetaMask.");
                setAccount(null);
                setContract(null);
            }
        });

        // Detect network change
        window.ethereum?.on("chainChanged", () => {
            console.warn("🔄 Network changed. Reloading...");
            window.location.reload();
        });

        return () => {
            window.ethereum?.removeListener("accountsChanged", connectBlockchain);
            window.ethereum?.removeListener("chainChanged", () => window.location.reload());
        };
    }, []);

    return (
        <div className="container">
            <h1>🗳️ Decentralized Voting App</h1>
            <p>Connected Account: <strong>{account || "Not Connected"}</strong></p>

            {account && (
                <div className="section">
                    <AdminPanel contract={contract} account={account} />
                </div>
            )}

            <div className="section">
                <VotingForm contract={contract} account={account} />
            </div>

            <div className="section">
                <CandidateList contract={contract} />
            </div>

            <div className="section">
                <ResultDisplay contract={contract} />
            </div>
        </div>
    );
};

export default App;