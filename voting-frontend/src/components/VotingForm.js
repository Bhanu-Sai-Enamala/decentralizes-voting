import React, { useState } from "react";

const VotingForm = ({ contract, account }) => {
  const [candidateIndex, setCandidateIndex] = useState("");
  const [status, setStatus] = useState("");

  const castVote = async () => {
    if (!contract || !account) {
      setStatus("❌ Connect your wallet first.");
      return;
    }

    if (candidateIndex.trim() === "" || isNaN(candidateIndex)) {
      setStatus("❌ Enter a valid candidate index.");
      return;
    }

    try {
      setStatus("📡 Uploading vote data to IPFS...");

      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voter: account, candidateIndex }),
      });

      const { cid } = await response.json();

      if (!cid) {
        setStatus("❌ Failed to upload vote to IPFS.");
        return;
      }

      setStatus("📡 Casting vote on blockchain...");
      const tx = await contract.vote(parseInt(candidateIndex), cid);
      await tx.wait();

      setStatus("🎉 Vote successfully recorded on blockchain!");
      setCandidateIndex("");
    } catch (error) {
      console.error("❌ Error while sending transaction:", error);
      if (error.reason?.includes("already voted")) {
        setStatus("❌ You can only vote once.");
      } else {
        setStatus("❌ Error casting vote. Check console for details.");
      }
    }
  };

  return (
    <div>
      <h2>Cast Your Vote</h2>
      <input
        type="text"
        placeholder="Candidate Index"
        value={candidateIndex}
        onChange={(e) => setCandidateIndex(e.target.value)}
      />
      <button onClick={castVote}>Vote</button>
      <p>{status}</p>
    </div>
  );
};

export default VotingForm;