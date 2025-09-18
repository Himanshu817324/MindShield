import { getBlockchainService } from './blockchain';
import { storage } from './storage';

export class BlockchainEventManager {
  private blockchain = getBlockchainService();
  private isListening = false;

  startListening() {
    if (this.isListening) return;

    console.log('🔊 Starting blockchain event listeners...');

    // Listen for access granted events
    this.blockchain.onAccessGranted(async (user: string, company: string, licenseId: number) => {
      console.log(`✅ Access granted: User ${user} granted access to company ${company}, License ID: ${licenseId}`);
      
      try {
        // Find the permission in database and update status
        const permissions = await storage.getUserPermissions(user);
        const permission = permissions.find(p => p.companyName === company);
        
        if (permission) {
          await storage.updatePermissionStatus(permission.id, 'active', `0x${licenseId.toString(16)}`);
          console.log(`📝 Updated permission ${permission.id} to active status`);
        }
      } catch (error) {
        console.error('Error updating permission status:', error);
      }
    });

    // Listen for access revoked events
    this.blockchain.onAccessRevoked(async (user: string, company: string, licenseId: number) => {
      console.log(`❌ Access revoked: User ${user} revoked access from company ${company}, License ID: ${licenseId}`);
      
      try {
        // Find the permission in database and update status
        const permissions = await storage.getUserPermissions(user);
        const permission = permissions.find(p => p.companyName === company);
        
        if (permission) {
          await storage.updatePermissionStatus(permission.id, 'revoked', `0x${licenseId.toString(16)}`);
          console.log(`📝 Updated permission ${permission.id} to revoked status`);
        }
      } catch (error) {
        console.error('Error updating permission status:', error);
      }
    });

    // Listen for payment made events
    this.blockchain.onPaymentMade(async (user: string, company: string, amount: string) => {
      console.log(`💰 Payment made: Company ${company} paid user ${user} amount ${amount} ETH`);
      
      try {
        // Find the user in database
        const userRecord = await storage.getUser(user);
        if (userRecord) {
          // Create earning record
          const earningAmount = Math.round(parseFloat(amount) * 100); // Convert to paise
          await storage.createEarning(userRecord.id, {
            permissionId: '', // This would need to be linked to the specific permission
            amount: earningAmount,
          });
          console.log(`📝 Created earning record for user ${userRecord.id}`);
        }
      } catch (error) {
        console.error('Error creating earning record:', error);
      }
    });

    this.isListening = true;
    console.log('✅ Blockchain event listeners started successfully');
  }

  stopListening() {
    if (!this.isListening) return;

    console.log('🔇 Stopping blockchain event listeners...');
    this.blockchain.removeAllListeners();
    this.isListening = false;
    console.log('✅ Blockchain event listeners stopped');
  }

  getStatus() {
    return {
      isListening: this.isListening,
      contractAddress: this.blockchain.contract?.target || 'Not connected'
    };
  }
}

// Export singleton instance
export const blockchainEventManager = new BlockchainEventManager();
