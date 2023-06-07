let  key = {"address":"2f1bb3767041f27920ffbec79141cc60d4913bd5","crypto":{"cipher":"aes-128-ctr","ciphertext":"aca0eb18f578579c7fba5a17a98e57198ea9b1dbe87d5412ba27a1051fcde173","cipherparams":{"iv":"6e5ac2b33e990679990c5054728f49a9"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"1697f28592c6aaf0f94f168cb5f4b2e2fbeb77f3261bb62b596134d921897394"},"mac":"57148c8cfc4f0e028d1d5074802eafd1096224d5b1388a73a18c12abe12b9333"},"id":"f6f1a25b-27f8-40a4-b789-f5a195e26585","version":3}


const Web3 = require('web3');
const fs = require('fs');

// Read the keystore file
const keystore = {"address":"17bae8ab57776eeb5d707f45f619d8c34d50ac9d","crypto":{"cipher":"aes-128-ctr","ciphertext":"d1ba89cc23c2e5d3d4e30d45f06926dc03786d4c329ad926007c0d96c78e914d","cipherparams":{"iv":"f9a3aef38876bd1fff2ca7206daffcb0"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"0077243d9dab6f791b7335fd4c4a01234a833064ce1c499e24448b62692f80e7"},"mac":"4d1b3f6d6c975f8f2ec4cb2dd7a08c7282bd2c31ede2ee5f797ef99f4f96d9a8"},"id":"1625d7bc-ee6d-4acf-ac5f-1a2314e5a495","version":3}
// Specify the password to decrypt the keystore
const password = 'Manshu@1234';

// Create a new instance of web3
const web3 = new Web3();

// Decrypt the keystore
const decryptedAccount = web3.eth.accounts.decrypt(keystore, password);

// Get the secret key from the decrypted account
const secretKey = decryptedAccount.privateKey;

console.log('Decrypted account address:', decryptedAccount.address);
console.log('Secret key:', secretKey);
