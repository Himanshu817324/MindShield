import hre from "hardhat";
import fs from 'fs';

async function main() {
  console.log("Starting deployment...");

  // Get the contract factory
  const DataLicense = await hre.ethers.getContractFactory("DataLicense");
  
  // Deploy the contract
  console.log("Deploying DataLicense contract...");
  const dataLicense = await DataLicense.deploy();
  
  // Wait for deployment to complete
  await dataLicense.waitForDeployment();
  
  const contractAddress = await dataLicense.getAddress();
  console.log("DataLicense deployed to:", contractAddress);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };
  
  // Update config file
  const configPath = './config.js';
  const configContent = `// Auto-generated deployment configuration
// Last updated: ${deploymentInfo.timestamp}

export default {
  contractAddress: "${contractAddress}",
  network: "${hre.network.name}",
  chainId: ${hre.network.config.chainId || 'unknown'},
  deployer: "${deploymentInfo.deployer}",
  deployedAt: "${deploymentInfo.timestamp}",
  blockNumber: ${deploymentInfo.blockNumber},
  
  // Contract ABI (essential functions only)
  abi: [
    {
      "inputs": [{"internalType": "string", "name": "_username", "type": "string"}],
      "name": "registerUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "_company", "type": "address"},
        {"internalType": "string", "name": "_dataTypes", "type": "string"},
        {"internalType": "uint256", "name": "_monthlyPayment", "type": "uint256"},
        {"internalType": "uint256", "name": "_durationMonths", "type": "uint256"}
      ],
      "name": "grantAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "_company", "type": "address"}],
      "name": "revokeAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "_user", "type": "address"},
        {"internalType": "uint256", "name": "_amount", "type": "uint256"}
      ],
      "name": "payUser",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "_user", "type": "address"},
        {"internalType": "address", "name": "_company", "type": "address"}
      ],
      "name": "isAccessActive",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
      "name": "getUserEarnings",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
      "name": "getUserLicenses",
      "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "company", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "licenseId", "type": "uint256"}
      ],
      "name": "AccessGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "company", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "licenseId", "type": "uint256"}
      ],
      "name": "AccessRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
        {"indexed": true, "internalType": "address", "name": "company", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
      ],
      "name": "PaymentMade",
      "type": "event"
    }
  ]
};
`;

  fs.writeFileSync(configPath, configContent);
  console.log("Configuration saved to:", configPath);
  
  // Verify contract on Etherscan (if API key is provided)
  if (process.env.POLYGONSCAN_API_KEY && hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await dataLicense.deploymentTransaction().wait(6);
    
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
  
  console.log("\\nDeployment Summary:");
  console.log("===================");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("Block Number:", deploymentInfo.blockNumber);
  console.log("\\nNext steps:");
  console.log("1. Update your environment variables with the contract address");
  console.log("2. Fund the deployer account with MATIC for gas fees");
  console.log("3. Test the contract functions using the provided config");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
