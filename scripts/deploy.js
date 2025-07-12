// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const ProductTracker = await hre.ethers.getContractFactory("ProductTracker");
  const tracker = await ProductTracker.deploy();
  await tracker.deployed();

  console.log(`✅ Contract deployed to: ${tracker.address}`);

  const contractData = {
    address: tracker.address,
    abi: JSON.parse(tracker.interface.formatJson()),
  };

  fs.writeFileSync(
    "./backend/contract-data.json",
    JSON.stringify(contractData, null, 2)
  );

  console.log(`✅ contract-data.json written to /backend`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
