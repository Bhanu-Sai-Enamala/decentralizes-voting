import { create } from "@web3-storage/w3up-client";
import keys from "./storacha-keys.json"; // Load stored keys

let client;

const initializeClient = async () => {
  try {
    if (!client) {
      console.log("🚀 Initializing IPFS client...");
      client = await create();

      if (!keys.delegationProof || !keys.spaceDID) {
        console.error("❌ Missing delegationProof or spaceDID in storacha-keys.json");
        throw new Error("Missing necessary IPFS credentials.");
      }

      console.log("🔑 Importing delegation proof...");
      const proofObject = await client.proofs.import(keys.delegationProof);
      await client.spaces.add(proofObject);
      await client.spaces.setCurrent(keys.spaceDID);

      console.log("✅ IPFS Client Initialized Successfully!");
    }
  } catch (error) {
    console.error("❌ Error initializing IPFS client:", error);
    throw error;
  }
};

// **Upload JSON data to Storacha IPFS**
export const uploadToIPFS = async (data) => {
  try {
    console.log("📤 Preparing data for IPFS upload:", data);
    await initializeClient();

    const file = new File([JSON.stringify(data)], "vote.json", { type: "application/json" });
    console.log("📁 File created for upload:", file);

    console.log("🚀 Uploading to Storacha...");
    const cid = await client.uploadFile(file);
    
    console.log("✅ IPFS Upload Successful! CID:", cid);
    return cid;
  } catch (error) {
    console.error("❌ Error uploading to IPFS:", error);
    return null;
  }
};

// **Fetch JSON Data from Storacha IPFS using CID**
export const fetchFromIPFS = async (cid) => {
  try {
    console.log(`🔍 Fetching data from IPFS: CID = ${cid}`);
    const response = await fetch(`https://storacha.network/ipfs/${cid}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ IPFS Fetch Failed:", errorText);
      throw new Error("Failed to fetch from IPFS.");
    }

    const data = await response.json();
    console.log("✅ Data Fetched from IPFS:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching data from IPFS:", error);
    return null;
  }
};