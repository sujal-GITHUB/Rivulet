// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const ProductTracker = await hre.ethers.getContractFactory("ProductTracker");

  console.log("🚀 Deploying ProductTracker...");
  const tracker = await ProductTracker.deploy();
  await tracker.waitForDeployment(); // ✅ Ethers v6 way

  console.log(`✅ Contract deployed to: ${tracker.target}`);

  const contractData = {
    address: tracker.target, // ✅ Ethers v6 uses .target instead of .address
    abi: JSON.parse(ProductTracker.interface.formatJson()), // use the factory's ABI
  };

  fs.writeFileSync(
    "./backend/contract-data.json",
    JSON.stringify(contractData, null, 2)
  );

  console.log(`✅ Contract data written to backend/contract-data.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
