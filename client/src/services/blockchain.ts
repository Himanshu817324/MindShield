import { ethers } from 'ethers';

// Contract configuration
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Will be updated after deployment
const CONTRACT_ABI = [
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
    "inputs": [{"internalType": "uint256", "name": "_licenseId", "type": "uint256"}],
    "name": "getLicenseDetails",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "user", "type": "address"},
          {"internalType": "address", "name": "company", "type": "address"},
          {"internalType": "string", "name": "dataTypes", "type": "string"},
          {"internalType": "uint256", "name": "monthlyPayment", "type": "uint256"},
          {"internalType": "uint256", "name": "startTime", "type": "uint256"},
          {"internalType": "uint256", "name": "endTime", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "internalType": "struct DataLicense.License",
        "name": "",
        "type": "tuple"
      }
    ],
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
];

export class BlockchainService {
  private contract: ethers.Contract;
  private signer: ethers.JsonRpcSigner;

  constructor(provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner) {
    this.signer = signer;
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  async registerUser(username: string): Promise<string> {
    try {
      const tx = await this.contract.registerUser(username);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Failed to register user on blockchain');
    }
  }

  async grantAccess(
    companyAddress: string,
    dataTypes: string,
    monthlyPayment: string,
    durationMonths: number
  ): Promise<string> {
    try {
      const tx = await this.contract.grantAccess(
        companyAddress,
        dataTypes,
        ethers.parseEther(monthlyPayment),
        durationMonths
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error granting access:', error);
      throw new Error('Failed to grant access on blockchain');
    }
  }

  async revokeAccess(companyAddress: string): Promise<string> {
    try {
      const tx = await this.contract.revokeAccess(companyAddress);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error revoking access:', error);
      throw new Error('Failed to revoke access on blockchain');
    }
  }

  async getUserEarnings(): Promise<string> {
    try {
      const address = await this.signer.getAddress();
      const earnings = await this.contract.getUserEarnings(address);
      return ethers.formatEther(earnings);
    } catch (error) {
      console.error('Error getting user earnings:', error);
      throw new Error('Failed to get user earnings from blockchain');
    }
  }

  async getUserLicenses(): Promise<number[]> {
    try {
      const address = await this.signer.getAddress();
      const licenses = await this.contract.getUserLicenses(address);
      return licenses.map((id: any) => Number(id));
    } catch (error) {
      console.error('Error getting user licenses:', error);
      throw new Error('Failed to get user licenses from blockchain');
    }
  }

  async isAccessActive(companyAddress: string): Promise<boolean> {
    try {
      const address = await this.signer.getAddress();
      return await this.contract.isAccessActive(address, companyAddress);
    } catch (error) {
      console.error('Error checking access status:', error);
      throw new Error('Failed to check access status on blockchain');
    }
  }

  async getLicenseDetails(licenseId: number): Promise<any> {
    try {
      const license = await this.contract.getLicenseDetails(licenseId);
      return {
        user: license.user,
        company: license.company,
        dataTypes: license.dataTypes,
        monthlyPayment: ethers.formatEther(license.monthlyPayment),
        startTime: Number(license.startTime),
        endTime: Number(license.endTime),
        isActive: license.isActive
      };
    } catch (error) {
      console.error('Error getting license details:', error);
      throw new Error('Failed to get license details from blockchain');
    }
  }

  // Event listeners
  onAccessGranted(callback: (user: string, company: string, licenseId: number) => void) {
    this.contract.on('AccessGranted', callback);
  }

  onAccessRevoked(callback: (user: string, company: string, licenseId: number) => void) {
    this.contract.on('AccessRevoked', callback);
  }

  onPaymentMade(callback: (user: string, company: string, amount: string) => void) {
    this.contract.on('PaymentMade', callback);
  }

  // Remove all listeners
  removeAllListeners() {
    this.contract.removeAllListeners();
  }
}

export function createBlockchainService(provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner): BlockchainService {
  return new BlockchainService(provider, signer);
}
