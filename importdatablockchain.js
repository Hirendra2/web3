const Web3 = require("web3");
var mongoUtil = require("./dbconfig");

const axios = require("axios");
const filename = "./Tokendata.json";
const fs = require("fs");

const web3 = new Web3("https://fufi.finance/rpc");

const  contractABI= [{"type":"constructor","stateMutability":"nonpayable","payable":false,"inputs":[]},{"type":"event","name":"DepositFunds","inputs":[{"type":"address","name":"from","internalType":"address","indexed":false},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"TransferFunds","inputs":[{"type":"address","name":"from","internalType":"address","indexed":false},{"type":"address","name":"to","internalType":"address","indexed":false},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"WithdrawFunds","inputs":[{"type":"address","name":"from","internalType":"address","indexed":false},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"fallback","stateMutability":"payable","payable":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"addOwner","inputs":[{"type":"address","name":"owner","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"blackList","inputs":[{"type":"address","name":"_user","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"removeFromBlacklist","inputs":[{"type":"address","name":"_user","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"removeOwner","inputs":[{"type":"address","name":"owner","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"transferTo","inputs":[{"type":"address","name":"to","internalType":"address payable"},{"type":"uint256","name":"amount","internalType":"uint256"}],"constant":false}]

async function getInternalTransactions(contractAddress) {
    const contractInstance = new web3.eth.Contract(
      contractABI,
      contractAddress
    ); 
    const events = await contractInstance.getPastEvents("allEvents", {
      fromBlock: 0,
    });
    console.log("events", events);

    const internalTransactions = events.filter(event => event.transactionHash !== event.blockHash);
    console.log(internalTransactions)
    await addToken(filename, internalTransactions);

  }
  const contractAddress = "0xA7Eb478f08DE6155a6a66E11c927E60B6aeb1cf5";
  getInternalTransactions(contractAddress);


function addToken(filename, data) {
  fs.readFile(filename, "utf8", (err, fileData) => {
    if (err) {
      console.error(err);
      return;
    }
    let jsonData = JSON.parse(fileData);
    jsonData.push(data);
    fs.writeFile(filename, JSON.stringify(jsonData), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Data appended to ${filename} successfully.`);
    });
  });
}