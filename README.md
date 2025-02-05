# ***Features of Smart Contract***

The smart contract implements all the required functionalities mentioned in the task:
1.	Adding a New Vote
	•	The contract allows registered voters to cast a vote for a candidate.
	•	Prevents double voting by maintaining a mapping of voted addresses.
	•	Ensures only valid candidates receive votes.
2.	Fetching the List of Candidates
	•	The contract stores candidate details in an array.
	•	Provides a function to fetch all registered candidates along with their vote count.
3.	Fetching the Vote Count for Each Candidate
	•	A function retrieves the vote count of each candidate.
	•	Used in the frontend to display real-time vote counts.
4.	Ensuring Only Registered Voters Can Vote (Bonus Implemented)
	•	The contract restricts voting to only registered addresses.
	•	The owner of the contract (admin) can register voters before voting begins.
5.	Displaying the Current Leader
	•	Implements a function to determine the candidate(s) with the highest votes.
	•	Returns the leader(s) dynamically based on vote count.
6.	IPFS Integration for Vote Storage (Bonus Implemented)
	•	Each vote’s details are stored on IPFS using Storacha Network.
	•	The IPFS CID is recorded in the smart contract for decentralized verification.
7.	Secure and Transparent Voting Process
	•	Uses Ethereum’s immutable blockchain to ensure fairness.
	•	Only the contract owner can add candidates and register voters.
	•	Prevents tampering with votes once they are cast.
8.	MetaMask Authentication
	•	Ensures that only connected wallet addresses can interact with the contract.
	•	Requires users to sign transactions before submitting votes.


# ***Setup Instructions***

# **Cloning The Repository**

1. Run `git clone https://github.com/Bhanu-Sai-Enamala/decentralizes-voting.git` from the terminal to clone the repository to the local system.
2. Run `npm install` from voting-contract directory once and then again from voting-frontend directory ocne to install all the dependencies. Preferably use VScode to work on the repository.


# **Deploying the contract and storing the contract address**

1. Change your working directory to `voting-contract`.
2. Create a .env file.
3. Inside the .env file, store your metamask private key in the format `PRIVATE_KEY = <Your Private Key>`
4. Get an RPC URL , for example from Infura for the testnet(I have used sepolia while developing) you are trying to deploy and store it inside .env file in this format `RPC_URL = <RPC URL link>`.
5. Now run the command `source .env` in the terminal from this working directory.
6. Then run the commadn `forge script script/Deploy.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast` to deploy the contract to the testnet.Make sure you have enough testnet tokens in your metamask wallet.
7. Once the contract is deployed, the contract address will be logged in the terminal. Copy it and store it in the .env of voting-frontend/src/config.js file(There is a placeholder set for the same, paste it there).
8. RUn `forge test` command to run the test file.

# **Setting Up IPFS with Web3.Storage**

Follow these steps to set up **IPFS storage** using **Web3.Storage CLI** and integrate it into your project.

1.Change working directory to voting-frontend directory.Install the CLI from npm using your command line: `npm install -g @web3-storage/w3cli`<br>
2.Run `w3 login alice@example.com` in the command line using your email address. This will send an email to your inbox with a link for validation.Once you click on the validation link, you'll be taken to a webpage where you can enter your payment information and select a plan (like our Free tier).Now you have created an account.You can cancel the subscription once you have tested the app.<br>
3.initiate space creation for a new Space: `w3 space create --no-recovery` . Follow the on screen instructions.Once the command is run, it will output a DID KEY for the space. Make a . env file and save it in this format `REACT_APP_SPACE_DID = <DID KEY HERE>`.<br>
4. Run `w3 login alice@example.com` in the command line using your email address. Click on the validation link sent to your email.<br>
5. You can see a list of the Spaces using `w3 space ls` and select the one you'd like to upload to using `w3 space use <space_name>`.<br>
6. The following command returns what will be your Agent private key and DID : `w3 key create`.The output will be similar to something below<br>
                `# did:key:<Agent DID>`<br>
                `<Agent Private Key>`<br>
                Save the above in . env file in the following format.<br>
                `REACT_APP_DID_KEY = <Agent DID>`<br>
                `REACT_APP_PRIVATE_KEY = <Agent Private Key>`<br>
7. Now run the following command `node generateDelegationProof.js` inside voting-frontend directory which will create the delegation proof and save it to .env file.

# **Starting the app**

1. Change the working directory to voting-frontend.
2. Run `cd scripts` and then run `node server.js` which sets up the local server.
3. open new terminal and change directory to `voting-frontend`.
4. run `npm start` command which will start the website on local host.
5. Open the site in preferable chrome browser and make sure Metamask is added as an extension and logged in and the network is set to whichever test net the contract is deployed to.
6. Now you can interact with the website.


# ***Instructions: How to Use the Decentralized Voting Website***

# **Connecting to Metamask**
	•	Ensure you have MetaMask installed in your browser.
	•	Open the website and connect your MetaMask wallet when prompted.
	•	The connected account address will be displayed at the top of the page.

# **Admin Panel (For Election Organizer)**

Only the contract owner can perform admin actions.

➤ Adding Candidates
	•	Enter the name of the candidate in the input field.
	•	Click “Add Candidate” to register them for the election.
	•	The candidate will be added to the blockchain and displayed in the Candidate List.

➤ Registering Voters
	•	Enter the Ethereum address of the voter in the input field.
	•	Click “Register Voter” to allow them to participate in the election.
	•	A message will confirm if the voter was registered successfully.

# **Casting a Vote (For Registered Voters)**

	•	Enter the index number of the candidate you wish to vote for.
	•	Click “Vote” to submit your vote.
	•	The vote is securely stored on IPFS (Storacha Network) before being recorded on the blockchain.
	•	If the vote is successful, a confirmation message will appear.

⚠️ Rules for Voting:
	•	You can only vote once.
	•	You must be a registered voter to participate.
	•	The voting data is permanently stored and cannot be modified.

# **Viewing Candidates and Election Results**

➤ Candidate List
	•	Displays all candidates with their respective index numbers, names, and vote counts.
	•	Use this list to find the index number before casting your vote.

➤ Current Leader
	•	Shows the candidate(s) with the highest number of votes.
	•	In case of a tie, all leading candidates will be displayed.

# **Additional Notes**

	•	The app interacts with a smart contract deployed on Ethereum.
	•	Votes are immutable and stored permanently on the blockchain.
	•	Data is uploaded to IPFS for decentralization before being stored in the smart contract.
	•	If you change your MetaMask account, the page may reload and require you to reconnect.