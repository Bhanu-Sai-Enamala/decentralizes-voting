import React, { useState, useEffect } from "react";

const ResultDisplay = ({ contract }) => {
  const [leaderData, setLeaderData] = useState(null);

  useEffect(() => {
    const fetchLeader = async () => {
      if (!contract) return;

      try {
        const [leaders, voteCount] = await contract.getCurrentLeader();
        console.log("Fetched leader(s):", leaders, "Votes:", voteCount);

        if (leaders.length > 0) {
          setLeaderData({ leaders, voteCount: voteCount.toString() }); // Convert to string if needed
        } else {
          setLeaderData(null);
        }
      } catch (error) {
        console.error("Error fetching current leader:", error);
      }
    };

    fetchLeader();
  }, [contract]);

  return (
    <div>
      <h2>🏆 Current Leader</h2>
      {leaderData ? (
        <p>🎉 Leader(s): {leaderData.leaders.join(", ")} with {leaderData.voteCount} votes.</p>
      ) : (
        <p>⚡ No votes have been cast yet.</p>
      )}
    </div>
  );
};

export default ResultDisplay;