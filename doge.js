const bitcoin = require('bitcoinjs-lib');

// Define Dogecoin network parameters
const network = {
  messagePrefix: '\x19Dogecoin Signed Message:\n',
  bech32: 'doge',
  bip32: {
    public: 0x02facafd, // Dogecoin uses a different public key prefix
    private: 0x02fac398,
  },
  pubKeyHash: 0x1e,
  scriptHash: 0x16,
  wif: 0x9e,
};

// Generate a new Dogecoin wallet
function createDogeWallet() {
  // Generate a new key pair
  const keyPair = bitcoin.ECPair.makeRandom({ network });

  // Get the public and private keys
  const publicKey = keyPair.publicKey.toString('hex');
  const privateKey = keyPair.toWIF();

  // Generate the corresponding address
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });

  // Return the wallet details
  return {
    publicKey,
    privateKey,
    address,
  };
}

// Usage example
const wallet = createDogeWallet();
console.log('Public Key:', wallet.publicKey);
console.log('Private Key:', wallet.privateKey);
console.log('Address:', wallet.address);
