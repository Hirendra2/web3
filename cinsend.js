// Example JSON arra
const fs = require("fs");
const Web3 = require("web3");
const blockchain = "./cinuser.json";

const web3 = new Web3("https://cinscan.cryptoxin.com");

let senderAddress = "0x00116C50aA26cafcE5d55EfBFE798C0422F54F67";
let senderPrivateKey =
  "e0a553feeeaf8f4bd50b2009fce833dc476128661972af880b38fcd66ad1631e";

async function getTotalAmountInEther(filename) {
  const rawData = fs.readFileSync(filename);
  const datas = JSON.parse(rawData);
  let data = datas.result;
  let count = 0;
  let Total =0;
  for (let i = 0; i <= data.length; i++) {
  // await sleep(10000);
    const element = data[i];
    let address = element.address;
    let amount = element.balance;
    count++;

    const balance = await web3.eth.getBalance(address);
    const ethBalance = web3.utils.fromWei(amount, 'ether');

    if (balance == 0) {
      Total=parseInt(Total)+parseInt(ethBalance)

      console.log("hhhhhhhj", count, address, ethBalance, data.length,Total, balance);
      //await sendEther(address, amount);

    }
    if (count === data.length) {
      console.log("All Done",Total);
    }
  }
}

async function sendEther(address, amount) {
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      from: senderAddress,
      to: address,
      value: amount,
      gas: "410000",
    },
    senderPrivateKey
  );
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(
    `Transaction successful with hash: ${createReceipt.transactionHash}`
  );
}

getTotalAmountInEther(blockchain);

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
