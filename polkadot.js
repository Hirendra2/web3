const { Keyring } = require('@polkadot/keyring');
const { mnemonicGenerate } = require('@polkadot/util-crypto');
const { waitReady } = require('@polkadot/wasm-crypto');

async function createWallet() {
  await waitReady();

  const mnemonic = mnemonicGenerate();
  const keyring = new Keyring({ type: 'sr25519', mnemonic });
  const pair = keyring.addFromUri('//Alice');
  const address = pair.address;
  console.log('Address:', address);
  console.log('Mnemonic:', mnemonic);
}

createWallet();
