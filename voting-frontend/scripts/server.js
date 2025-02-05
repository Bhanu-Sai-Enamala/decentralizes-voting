const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.post("/upload", async (req, res) => {
  let filePath = null;
  try {
    const { voter, candidateIndex } = req.body;
    if (!voter || candidateIndex === undefined) {
      return res.status(400).json({ error: "Invalid vote data" });
    }

    const filename = `vote_${Date.now()}.txt`;
    filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));

    const spaceDID = process.env.REACT_APP_SPACE_DID;
    if (!spaceDID) {
      return res.status(500).json({ error: "Missing SPACE_DID in environment variables" });
    }

    const uploadCommand = `w3 up --space did:key:${spaceDID} ${filePath}`;
    const uploadResult = execSync(uploadCommand).toString().trim();

    res.json({ cid: uploadResult });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return res.status(500).json({ error: error.message || "Upload failed" });
  } finally {
    if (filePath) fs.unlinkSync(filePath);
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));