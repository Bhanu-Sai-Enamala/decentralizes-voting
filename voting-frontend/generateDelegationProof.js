const fs = require("fs");
const { execSync } = require("child_process");
require("dotenv").config(); // Load existing .env variables

async function generateKeysAndProof() {
    console.log("🚀 Using Pre-Generated DID & Private Key...");

    const agentDID = process.env.REACT_APP_DID_KEY;
    const privateKey = process.env.REACT_APP_PRIVATE_KEY;

    if (!agentDID || !privateKey) {
        console.error("❌ REACT_APP_DID_KEY or REACT_APP_PRIVATE_KEY is missing in .env");
        process.exit(1);
    }

    console.log(`✅ Loaded Agent DID: ${agentDID}`);

    console.log("🔍 Fetching current Storacha space...");
    const spaceDID = process.env.REACT_APP_SPACE_DID;

    if (!spaceDID) {
        console.error("❌ REACT_APP_SPACE_DID is missing in .env! Please create a space and update the .env file.");
        process.exit(1);
    }

    console.log(`✅ Using Space DID: ${spaceDID}`);

    console.log("🔑 Generating delegation proof...");
    const proofCommand = `w3 delegation create did:key:${agentDID} --base64`;
    const proof = execSync(proofCommand).toString().trim();

    console.log("✅ Delegation proof generated!");

    // Update or append to .env file
    const envPath = ".env";
    let envContent = "";

    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8");

        // Remove any existing REACT_APP_DELEGATION_PROOF entry
        envContent = envContent.split("\n").filter(line => !line.startsWith("REACT_APP_DELEGATION_PROOF=")).join("\n");
    }

    // Append the new delegation proof
    envContent += `\nREACT_APP_DELEGATION_PROOF=${proof}\n`;

    fs.writeFileSync(envPath, envContent.trim() + "\n", "utf8");

    console.log(`✅ Delegation proof saved in .env`);
}

generateKeysAndProof().catch(console.error);