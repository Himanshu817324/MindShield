#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Deploying MindShield Blockchain...\n");

try {
  // Check if we're in the right directory
  if (!fs.existsSync("blockchain/package.json")) {
    throw new Error("Please run this script from the project root directory");
  }

  // Install blockchain dependencies
  console.log("📦 Installing blockchain dependencies...");
  execSync("cd blockchain && npm install", { stdio: "inherit" });

  // Check if .env file exists
  if (!fs.existsSync("blockchain/.env")) {
    console.log("⚠️  Creating blockchain/.env file...");
    const envContent = `# Blockchain Configuration
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
`;
    fs.writeFileSync("blockchain/.env", envContent);
    console.log(
      "✅ Created blockchain/.env file. Please add your private key and API key."
    );
  }

  // Deploy the contract
  console.log("🔨 Deploying smart contract...");
  
  // Try local deployment first
  try {
    console.log("📝 Attempting local deployment...");
    execSync(
      "cd blockchain && npx hardhat run scripts/deploy.js --network hardhat",
      { stdio: "inherit" }
    );
    console.log("✅ Local deployment successful!");
  } catch (localError) {
    console.log("⚠️  Local deployment failed, trying Mumbai testnet...");
    try {
      execSync(
        "cd blockchain && npx hardhat run scripts/deploy.js --network mumbai",
        { stdio: "inherit" }
      );
      console.log("✅ Mumbai deployment successful!");
    } catch (mumbaiError) {
      console.log("⚠️  Mumbai deployment failed, using local deployment...");
      execSync(
        "cd blockchain && npx hardhat run scripts/deploy.js --network hardhat",
        { stdio: "inherit" }
      );
      console.log("✅ Local deployment successful!");
    }
  }

  // Update the frontend contract address
  console.log("🔄 Updating frontend contract address...");
  const configPath = "blockchain/config.js";
  if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, "utf8");
    const contractAddressMatch = configContent.match(
      /contractAddress: "([^"]+)"/
    );

    if (
      contractAddressMatch &&
      contractAddressMatch[1] !== "0x0000000000000000000000000000000000000000"
    ) {
      const contractAddress = contractAddressMatch[1];

      // Update frontend blockchain service
      const frontendServicePath = "client/src/services/blockchain.ts";
      if (fs.existsSync(frontendServicePath)) {
        let frontendContent = fs.readFileSync(frontendServicePath, "utf8");
        frontendContent = frontendContent.replace(
          /const CONTRACT_ADDRESS = '[^']+';/,
          `const CONTRACT_ADDRESS = '${contractAddress}';`
        );
        fs.writeFileSync(frontendServicePath, frontendContent);
        console.log("✅ Updated frontend contract address");
      }

      // Update blockchain status component
      const blockchainStatusPath =
        "client/src/components/dashboard/blockchain-status.tsx";
      if (fs.existsSync(blockchainStatusPath)) {
        let statusContent = fs.readFileSync(blockchainStatusPath, "utf8");
        statusContent = statusContent.replace(
          /const CONTRACT_ADDRESS = '[^']+';/,
          `const CONTRACT_ADDRESS = '${contractAddress}';`
        );
        fs.writeFileSync(blockchainStatusPath, statusContent);
        console.log("✅ Updated blockchain status component");
      }
    }
  }

  console.log("\n🎉 Blockchain deployment completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Add your private key to blockchain/.env");
  console.log("2. Add your PolygonScan API key to blockchain/.env");
  console.log("3. Run: npm run dev");
  console.log("4. Connect your wallet in the frontend");
} catch (error) {
  console.error("❌ Deployment failed:", error.message);
  process.exit(1);
}
