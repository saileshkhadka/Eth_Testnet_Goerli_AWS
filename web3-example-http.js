import dotenv from 'dotenv';
dotenv.config();
import AWSHttpSigV4_v2Provider from './awsHttpSigV4-v2.js';
import Web3 from 'web3';

// Import the fs module to read files
import fs from 'fs'

// Read the JSON file and parse it
const contractJSON = JSON.parse(fs.readFileSync('./artifacts/contracts/TestContract.sol/HelloWorld.json', 'utf8'));

// Get the ABI and the bytecode from the JSON file
const abi = contractJSON.abi;
const code = contractJSON.bytecode;
const endpoint = process.env.AMB_HTTP_ENDPOINT
const web3 = new Web3(new AWSHttpSigV4_v2Provider(endpoint));
const private_key = process.env.WALLET_PRIVATE_KEY;

// Add your private key to the web3.js wallet
web3.eth.accounts.wallet.add(private_key);

// Get the address associated with your private key
const address = web3.eth.accounts.wallet[0].address;

// Create a contract instance using the ABI
const SampleContract = new web3.eth.Contract(abi, address);

// Deploy the contract using the bytecode and the sender address
// You can also pass some arguments if your contract constructor requires them
const contract = SampleContract.deploy({from: address, data: code});


console.log(address); // Your address

//console.log(contractJSON);

// Send the deployment transaction to the network and get the receipt
contract.send({from: address}, (error, transactionHash) => {
  if (error) {
    console.error(error);
  } else {
    console.log(transactionHash);
    web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
      if (error) {
        console.error(error);
      } else {
        console.log(receipt);
        // Once the transaction is confirmed, you can access your deployed contract using its address or its methods
        // For example, you can call the name method of your contract
        contract.methods.name().call((error, result) => {
          if (error) {
            console.error(error);
          } else {
            console.log(result);
          }
        });
      }
    });
  }
});

web3.eth.getNodeInfo().then(console.log);