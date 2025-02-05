import React, { useState, useEffect } from "react";

const CandidateList = ({ contract }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!contract) return;

      try {
        const candidatesArray = await contract.getCandidates();
        console.log("Fetched candidates:", candidatesArray);

        // Ensure each candidate has a corresponding index
        const formattedCandidates = candidatesArray.map((candidate, index) => ({
          index,
          name: candidate.name,
          voteCount: candidate.voteCount.toString(), // Convert BigNumber to string
        }));

        setCandidates(formattedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, [contract]);

  return (
    <div>
      <h2>Candidate List</h2>
      {candidates.length > 0 ? (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.index}>
              <strong>Index:</strong> {candidate.index} | <strong>Name:</strong> {candidate.name} | <strong>Votes:</strong> {candidate.voteCount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No candidates available.</p>
      )}
    </div>
  );
};

export default CandidateList;