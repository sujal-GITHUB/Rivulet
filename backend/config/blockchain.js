const { ethers } = require("ethers");
require("dotenv").config();

const { address, abi } = require("../contract-data.json");

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(address, abi, signer);

console.log(`Connected to contract at: ${address}`);

module.exports = contract;
