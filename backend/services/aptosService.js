const { AptosClient, AptosAccount, TxnBuilderTypes, BCS, TransactionPayloadEntryFunction } = require('aptos');

class AptosService {
  constructor() {
    this.client = new AptosClient(process.env.APTOS_NODE_URL || 'https://fullnode.testnet.aptoslabs.com');
    this.faucetClient = new AptosClient(process.env.APTOS_FAUCET_URL || 'https://faucet.testnet.aptoslabs.com');
    
    // Initialize account with private key only if provided and valid
    if (process.env.APTOS_PRIVATE_KEY && process.env.APTOS_PRIVATE_KEY.trim() !== '') {
      try {
        this.account = new AptosAccount(Buffer.from(process.env.APTOS_PRIVATE_KEY, 'hex'));
      } catch (error) {
        console.warn('Invalid APTOS_PRIVATE_KEY provided, blockchain features will be limited');
        this.account = null;
      }
    } else {
      this.account = null;
    }
    
    this.moduleAddress = process.env.APTOS_MODULE_ADDRESS;
    this.moduleName = 'phoolse_fayda';
  }

  // Initialize Aptos account
  async initializeAccount() {
    try {
      if (!this.account) {
        // Generate new account if no private key provided
        this.account = new AptosAccount();
        console.log('Generated new Aptos account:', this.account.address().toString());
        console.log('Private key:', this.account.privateKey.toString('hex'));
      }
      
      return {
        address: this.account.address().toString(),
        publicKey: this.account.publicKey().toString('hex'),
        privateKey: this.account.privateKey.toString('hex')
      };
    } catch (error) {
      console.error('Error initializing Aptos account:', error);
      throw error;
    }
  }

  // Get account balance
  async getBalance(address) {
    try {
      const resources = await this.client.getAccountResources(address);
      const coinResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
      
      if (coinResource) {
        return parseInt(coinResource.data.coin.value) / 100000000; // Convert from octas to APT
      }
      
      return 0;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  // Fund account with test tokens (for testnet/devnet)
  async fundAccount(address, amount = 1000000000) {
    try {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Cannot fund account in production');
      }
      
      const response = await this.faucetClient.fundAccount(address, amount);
      console.log('Account funded:', response);
      return response;
    } catch (error) {
      console.error('Error funding account:', error);
      throw error;
    }
  }

  // Create flower waste pickup record on blockchain
  async createPickupRecord(pickupData) {
    try {
      if (!this.account || !this.moduleAddress) {
        // Return mock transaction for development when blockchain is not configured
        if (process.env.NODE_ENV === 'development') {
          console.log('Blockchain not configured, returning mock transaction');
          return {
            hash: 'mock_' + Date.now(),
            status: 'mock',
            timestamp: new Date()
          };
        }
        throw new Error('Aptos account or module address not configured');
      }

      const payload = new TransactionPayloadEntryFunction(
        new TxnBuilderTypes.EntryFunction(
          new TxnBuilderTypes.ModuleId(
            new TxnBuilderTypes.AccountAddress(this.moduleAddress),
            new TxnBuilderTypes.Identifier(this.moduleName)
          ),
          new TxnBuilderTypes.Identifier('create_pickup'),
          [],
          [
            BCS.bcsSerializeStr(pickupData.pickupId),
            BCS.bcsSerializeU64(pickupData.estimatedWeight),
            BCS.bcsSerializeStr(pickupData.locationType),
            BCS.bcsSerializeStr(pickupData.contactName),
            BCS.bcsSerializeU64(Math.floor(new Date(pickupData.preferredDate).getTime() / 1000))
          ]
        )
      );

      const rawTxn = await this.client.generateTransaction(this.account.address(), payload);
      const bcsTxn = await this.client.signTransaction(this.account, rawTxn);
      const transactionRes = await this.client.submitTransaction(bcsTxn);
      
      // Wait for transaction confirmation
      await this.client.waitForTransaction(transactionRes.hash);

      return {
        txHash: transactionRes.hash,
        status: 'confirmed',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error creating pickup record on blockchain:', error);
      throw error;
    }
  }

  // Update pickup status on blockchain
  async updatePickupStatus(pickupId, newStatus, actualWeight = 0) {
    try {
      if (!this.account || !this.moduleAddress) {
        // Return mock transaction for development when blockchain is not configured
        if (process.env.NODE_ENV === 'development') {
          console.log('Blockchain not configured, returning mock transaction');
          return {
            hash: 'mock_' + Date.now(),
            status: 'mock',
            timestamp: new Date()
          };
        }
        throw new Error('Aptos account or module address not configured');
      }

      const payload = new TransactionPayloadEntryFunction(
        new TxnBuilderTypes.EntryFunction(
          new TxnBuilderTypes.ModuleId(
            new TxnBuilderTypes.AccountAddress(this.moduleAddress),
            new TxnBuilderTypes.Identifier(this.moduleName)
          ),
          new TxnBuilderTypes.Identifier('update_pickup_status'),
          [],
          [
            BCS.bcsSerializeStr(pickupId),
            BCS.bcsSerializeStr(newStatus),
            BCS.bcsSerializeU64(actualWeight)
          ]
        )
      );

      const rawTxn = await this.client.generateTransaction(this.account.address(), payload);
      const bcsTxn = await this.client.signTransaction(this.account, rawTxn);
      const transactionRes = await this.client.submitTransaction(bcsTxn);
      
      await this.client.waitForTransaction(transactionRes.hash);

      return {
        txHash: transactionRes.hash,
        status: 'confirmed',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error updating pickup status on blockchain:', error);
      throw error;
    }
  }

  // Award points to user on blockchain
  async awardPoints(userAddress, points, reason) {
    try {
      if (!this.account || !this.moduleAddress) {
        // Return mock transaction for development when blockchain is not configured
        if (process.env.NODE_ENV === 'development') {
          console.log('Blockchain not configured, returning mock transaction');
          return {
            hash: 'mock_' + Date.now(),
            status: 'mock',
            timestamp: new Date()
          };
        }
        throw new Error('Aptos account or module address not configured');
      }

      const payload = new TransactionPayloadEntryFunction(
        new TxnBuilderTypes.EntryFunction(
          new TxnBuilderTypes.ModuleId(
            new TxnBuilderTypes.AccountAddress(this.moduleAddress),
            new TxnBuilderTypes.Identifier(this.moduleName)
          ),
          new TxnBuilderTypes.Identifier('award_points'),
          [],
          [
            BCS.bcsSerializeAddress(new TxnBuilderTypes.AccountAddress(userAddress)),
            BCS.bcsSerializeU64(points),
            BCS.bcsSerializeStr(reason)
          ]
        )
      );

      const rawTxn = await this.client.generateTransaction(this.account.address(), payload);
      const bcsTxn = await this.client.signTransaction(this.account, rawTxn);
      const transactionRes = await this.client.submitTransaction(bcsTxn);
      
      await this.client.waitForTransaction(transactionRes.hash);

      return {
        txHash: transactionRes.hash,
        status: 'confirmed',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error awarding points on blockchain:', error);
      throw error;
    }
  }

  // Get user points from blockchain
  async getUserPoints(userAddress) {
    try {
      const resources = await this.client.getAccountResources(userAddress);
      const pointsResource = resources.find(r => 
        r.type === `${this.moduleAddress}::${this.moduleName}::UserPoints`
      );
      
      if (pointsResource) {
        return {
          totalPoints: parseInt(pointsResource.data.total_points),
          earnedPoints: parseInt(pointsResource.data.earned_points),
          spentPoints: parseInt(pointsResource.data.spent_points)
        };
      }
      
      return {
        totalPoints: 0,
        earnedPoints: 0,
        spentPoints: 0
      };
    } catch (error) {
      console.error('Error getting user points:', error);
      return {
        totalPoints: 0,
        earnedPoints: 0,
        spentPoints: 0
      };
    }
  }

  // Get environmental impact data from blockchain
  async getEnvironmentalImpact() {
    try {
      const resources = await this.client.getAccountResources(this.moduleAddress);
      const impactResource = resources.find(r => 
        r.type === `${this.moduleAddress}::${this.moduleName}::EnvironmentalImpact`
      );
      
      if (impactResource) {
        return {
          totalCO2Saved: parseFloat(impactResource.data.total_co2_saved),
          totalTreesEquivalent: parseFloat(impactResource.data.total_trees_equivalent),
          totalWaterSaved: parseFloat(impactResource.data.total_water_saved),
          totalWasteDiverted: parseFloat(impactResource.data.total_waste_diverted)
        };
      }
      
      return {
        totalCO2Saved: 0,
        totalTreesEquivalent: 0,
        totalWaterSaved: 0,
        totalWasteDiverted: 0
      };
    } catch (error) {
      console.error('Error getting environmental impact:', error);
      return {
        totalCO2Saved: 0,
        totalTreesEquivalent: 0,
        totalWaterSaved: 0,
        totalWasteDiverted: 0
      };
    }
  }

  // Verify transaction on blockchain
  async verifyTransaction(txHash) {
    try {
      const transaction = await this.client.getTransactionByHash(txHash);
      
      if (transaction.success) {
        return {
          verified: true,
          status: 'success',
          timestamp: new Date(parseInt(transaction.timestamp)),
          gasUsed: transaction.gas_used,
          gasUnitPrice: transaction.gas_unit_price
        };
      } else {
        return {
          verified: false,
          status: 'failed',
          error: transaction.vm_status
        };
      }
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return {
        verified: false,
        status: 'error',
        error: error.message
      };
    }
  }

  // Get transaction history for an address
  async getTransactionHistory(address, limit = 20) {
    try {
      const transactions = await this.client.getAccountTransactions(address, { limit });
      
      return transactions.map(tx => ({
        hash: tx.hash,
        timestamp: new Date(parseInt(tx.timestamp)),
        success: tx.success,
        gasUsed: tx.gas_used,
        gasUnitPrice: tx.gas_unit_price,
        vmStatus: tx.vm_status
      }));
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  // Health check for Aptos connection
  async healthCheck() {
    try {
      const ledgerInfo = await this.client.getLedgerInfo();
      return {
        status: 'healthy',
        chainId: ledgerInfo.chain_id,
        epoch: ledgerInfo.epoch,
        ledgerVersion: ledgerInfo.ledger_version,
        timestamp: new Date(parseInt(ledgerInfo.timestamp))
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Get connection status (alias for healthCheck)
  async getConnectionStatus() {
    return this.healthCheck();
  }

  // Get account resources
  async getResources(address) {
    try {
      const resources = await this.client.getAccountResources(address);
      return resources.map(resource => ({
        type: resource.type,
        data: resource.data
      }));
    } catch (error) {
      console.error('Error getting resources:', error);
      return [];
    }
  }

  // Record pickup on blockchain (alias for createPickupRecord)
  async recordPickup(pickupData) {
    return this.createPickupRecord(pickupData);
  }

  // Claim rewards on blockchain
  async claimRewards(rewardData) {
    try {
      if (!this.account || !this.moduleAddress) {
        // Return mock transaction for development when blockchain is not configured
        if (process.env.NODE_ENV === 'development') {
          console.log('Blockchain not configured, returning mock transaction');
          return {
            hash: 'mock_' + Date.now(),
            status: 'mock',
            timestamp: new Date()
          };
        }
        throw new Error('Aptos account or module address not configured');
      }

      const payload = new TransactionPayloadEntryFunction(
        new TxnBuilderTypes.EntryFunction(
          new TxnBuilderTypes.ModuleId(
            new TxnBuilderTypes.AccountAddress(this.moduleAddress),
            new TxnBuilderTypes.Identifier(this.moduleName)
          ),
          new TxnBuilderTypes.Identifier('claim_rewards'),
          [],
          [
            BCS.bcsSerializeAddress(new TxnBuilderTypes.AccountAddress(rewardData.userAddress)),
            BCS.bcsSerializeU64(rewardData.amount),
            BCS.bcsSerializeU64(Math.floor(rewardData.timestamp.getTime() / 1000))
          ]
        )
      );

      const rawTxn = await this.client.generateTransaction(this.account.address(), payload);
      const bcsTxn = await this.client.signTransaction(this.account, rawTxn);
      const transactionRes = await this.client.submitTransaction(bcsTxn);
      
      await this.client.waitForTransaction(transactionRes.hash);

      return {
        hash: transactionRes.hash,
        blockNumber: transactionRes.sequence_number,
        status: 'confirmed',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error claiming rewards on blockchain:', error);
      throw error;
    }
  }

  // Get transaction details
  async getTransaction(txHash) {
    try {
      const transaction = await this.client.getTransactionByHash(txHash);
      return {
        hash: transaction.hash,
        success: transaction.success,
        timestamp: new Date(parseInt(transaction.timestamp)),
        gasUsed: transaction.gas_used,
        gasUnitPrice: transaction.gas_unit_price,
        vmStatus: transaction.vm_status
      };
    } catch (error) {
      console.error('Error getting transaction:', error);
      return {
        hash: txHash,
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AptosService();
