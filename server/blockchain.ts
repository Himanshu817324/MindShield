import { ethers } from 'ethers';
import config from '../blockchain/config.js';

export interface BlockchainConfig {
  contractAddress: string;
  network: string;
  chainId: number;
  rpcUrl: string;
  privateKey: string;
}

export interface LicenseData {
  user: string;
  company: string;
  dataTypes: string;
  monthlyPayment: string;
  durationMonths: number;
}

export interface PaymentData {
  user: string;
  amount: string;
}

export class BlockchainService {
    
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(config: BlockchainConfig) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    this.contract = new ethers.Contract(
      config.contractAddress,
      config.abi,
      this.wallet
    );
  }

  async registerUser(username: string, userAddress: string): Promise<string> {
    try {
      // Connect to user's wallet for the transaction
      const userWallet = new ethers.Wallet(userAddress, this.provider);
      const userContract = this.contract.connect(userWallet);
      
      const tx = await userContract.registerUser(username);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Failed to register user on blockchain');
    }
  }

  async grantAccess(licenseData: LicenseData, userAddress: string): Promise<string> {
    try {
      const userWallet = new ethers.Wallet(userAddress, this.provider);
      const userContract = this.contract.connect(userWallet);
      
      const tx = await userContract.grantAccess(
        licenseData.company,
        licenseData.dataTypes,
        ethers.parseEther(licenseData.monthlyPayment),
        licenseData.durationMonths
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error granting access:', error);
      throw new Error('Failed to grant access on blockchain');
    }
  }

  async revokeAccess(companyAddress: string, userAddress: string): Promise<string> {
    try {
      const userWallet = new ethers.Wallet(userAddress, this.provider);
      const userContract = this.contract.connect(userWallet);
      
      const tx = await userContract.revokeAccess(companyAddress);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error revoking access:', error);
      throw new Error('Failed to revoke access on blockchain');
    }
  }

  async payUser(paymentData: PaymentData): Promise<string> {
    try {
      const tx = await this.contract.payUser(
        paymentData.user,
        ethers.parseEther(paymentData.amount),
        { value: ethers.parseEther(paymentData.amount) }
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error('Failed to process payment on blockchain');
    }
  }

  async getUserEarnings(userAddress: string): Promise<string> {
    try {
      const earnings = await this.contract.getUserEarnings(userAddress);
      return ethers.formatEther(earnings);
    } catch (error) {
      console.error('Error getting user earnings:', error);
      throw new Error('Failed to get user earnings from blockchain');
    }
  }

  async getUserLicenses(userAddress: string): Promise<number[]> {
    try {
      const licenses = await this.contract.getUserLicenses(userAddress);
      return licenses.map((id: any) => Number(id));
    } catch (error) {
      console.error('Error getting user licenses:', error);
      throw new Error('Failed to get user licenses from blockchain');
    }
  }

  async isAccessActive(userAddress: string, companyAddress: string): Promise<boolean> {
    try {
      return await this.contract.isAccessActive(userAddress, companyAddress);
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

// Initialize blockchain service
let blockchainService: BlockchainService | null = null;

export function getBlockchainService(): BlockchainService {
  if (!blockchainService) {
    const blockchainConfig: BlockchainConfig = {
      contractAddress: config.contractAddress,
      network: config.network,
      chainId: config.chainId,
      rpcUrl: process.env.POLYGON_MUMBAI_RPC || 'https://rpc-mumbai.maticvigil.com',
      privateKey: process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' // Hardhat default private key
    };

    if (!blockchainConfig.contractAddress || blockchainConfig.contractAddress === '0x0000000000000000000000000000000000000000') {
      console.log('⚠️  Blockchain contract not deployed. Using mock blockchain service for development.');
      // Return a mock blockchain service for development
      return new MockBlockchainService();
    }

    try {
      blockchainService = new BlockchainService(blockchainConfig);
    } catch (error) {
      console.log('⚠️  Failed to initialize blockchain service. Using mock service for development.');
      return new MockBlockchainService();
    }
  }

  return blockchainService;
}

// Mock blockchain service for development
class MockBlockchainService {
  async registerUser(username: string, userAddress: string): Promise<string> {
    console.log(`🔧 Mock: Registering user ${username} with address ${userAddress}`);
    return '0x' + Math.random().toString(16).substr(2, 64);
  }

  async grantAccess(licenseData: LicenseData, userAddress: string): Promise<string> {
    console.log(`🔧 Mock: Granting access for user ${userAddress} to company ${licenseData.company}`);
    return '0x' + Math.random().toString(16).substr(2, 64);
  }

  async revokeAccess(companyAddress: string, userAddress: string): Promise<string> {
    console.log(`🔧 Mock: Revoking access for user ${userAddress} from company ${companyAddress}`);
    return '0x' + Math.random().toString(16).substr(2, 64);
  }

  async payUser(paymentData: PaymentData): Promise<string> {
    console.log(`🔧 Mock: Paying user ${paymentData.user} amount ${paymentData.amount}`);
    return '0x' + Math.random().toString(16).substr(2, 64);
  }

  async getUserEarnings(userAddress: string): Promise<string> {
    console.log(`🔧 Mock: Getting earnings for user ${userAddress}`);
    return '0.5'; // Mock earnings
  }

  async getUserLicenses(userAddress: string): Promise<number[]> {
    console.log(`🔧 Mock: Getting licenses for user ${userAddress}`);
    return [1, 2, 3]; // Mock license IDs
  }

  async isAccessActive(userAddress: string, companyAddress: string): Promise<boolean> {
    console.log(`🔧 Mock: Checking access status for user ${userAddress} and company ${companyAddress}`);
    return true; // Mock active access
  }

  async getLicenseDetails(licenseId: number): Promise<any> {
    console.log(`🔧 Mock: Getting license details for ID ${licenseId}`);
    return {
      user: '0x' + Math.random().toString(16).substr(2, 40),
      company: '0x' + Math.random().toString(16).substr(2, 40),
      dataTypes: 'location,behavior,preferences',
      monthlyPayment: '0.1',
      startTime: Date.now(),
      endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isActive: true
    };
  }

  onAccessGranted(callback: (user: string, company: string, licenseId: number) => void) {
    console.log('🔧 Mock: Setting up access granted listener');
  }

  onAccessRevoked(callback: (user: string, company: string, licenseId: number) => void) {
    console.log('🔧 Mock: Setting up access revoked listener');
  }

  onPaymentMade(callback: (user: string, company: string, amount: string) => void) {
    console.log('🔧 Mock: Setting up payment made listener');
  }

  removeAllListeners() {
    console.log('🔧 Mock: Removing all listeners');
  }
}
