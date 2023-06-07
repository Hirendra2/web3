const { ApiPromise, Keyring } = require("@polkadot/api");
async function connect() {
  const api = await ApiPromise.create({ provider: "wss://rpc.polkadot.io" });
  return api;
}

let sender = "";
let recipient = "";
let amount = "";

async function sendTransaction(sender, to, amount) {
  const api = await connect();
  const tx = api.tx.balances.transfer(to, amount);
  const { nonce, system } = await api.query.system.account(sender);
  const { signature } = await tx.signAsync(sender, { nonce, era: 0 });
  const hash = await tx.sendAsync({ nonce, era: 0 }, (result) => {
    if (result.status.isInBlock) {
      console.log(
        `Transaction included at block hash: ${result.status.asInBlock}`
      );
    } else if (result.status.isFinalized) {
      console.log(
        `Transaction finalized at block hash: ${result.status.asFinalized}`
      );
    }
  });
  console.log(`Transaction hash: ${hash}`);
}

sendTransaction(sender, recipient, amount);
