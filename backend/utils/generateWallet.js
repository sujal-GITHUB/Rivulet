// Utility function to generate unique wallet addresses for testing
const crypto = require('crypto');

function generateWalletAddress() {
  // Generate a random 20-byte address
  const addressBytes = crypto.randomBytes(20);
  const address = '0x' + addressBytes.toString('hex');
  return address;
}

function generateMultipleWallets(count = 1) {
  const wallets = [];
  for (let i = 0; i < count; i++) {
    wallets.push(generateWalletAddress());
  }
  return wallets;
}

module.exports = {
  generateWalletAddress,
  generateMultipleWallets
}; 