// Auto-generated deployment configuration
// Last updated: 2025-09-16T19:36:40.453Z

export default {
  contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  network: "hardhat",
  chainId: 31337,
  deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  deployedAt: "2025-09-16T19:36:40.453Z",
  blockNumber: 1,
  
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
