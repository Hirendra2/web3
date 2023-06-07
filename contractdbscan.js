const { ethers } = require("ethers");
var Web3 = require("web3");
const moment = require("moment");
var axios = require("axios");
const shortid = require("shortid");
var mongoUtil = require("./dbconfig");
var url = "https://fufi.finance/rpc";
var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
const { Worker } = require("worker_threads");
var db;
var Web3 = require("web3");
var web3 = new Web3(
  new Web3.providers.HttpProvider("https://fufi.finance/rpc")
); // your web3 provider
var abiDecoder = require("abi-decoder");

var ABI = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    payable: false,
    inputs: [],
  },
  {
    type: "event",
    name: "DepositFunds",
    inputs: [
      {
        type: "address",
        name: "from",
        internalType: "address",
        indexed: false,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TransferFunds",
    inputs: [
      {
        type: "address",
        name: "from",
        internalType: "address",
        indexed: false,
      },
      { type: "address", name: "to", internalType: "address", indexed: false },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WithdrawFunds",
    inputs: [
      {
        type: "address",
        name: "from",
        internalType: "address",
        indexed: false,
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  { type: "fallback", stateMutability: "payable", payable: true },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "addOwner",
    inputs: [{ type: "address", name: "owner", internalType: "address" }],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "blackList",
    inputs: [{ type: "address", name: "_user", internalType: "address" }],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "removeFromBlacklist",
    inputs: [{ type: "address", name: "_user", internalType: "address" }],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "removeOwner",
    inputs: [{ type: "address", name: "owner", internalType: "address" }],
    constant: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    payable: false,
    outputs: [],
    name: "transferTo",
    inputs: [
      { type: "address", name: "to", internalType: "address payable" },
      { type: "uint256", name: "amount", internalType: "uint256" },
    ],
    constant: false,
  },
]; // abi of your contract

mongoUtil.connectToServer(async function (err, client) {
  if (err) {
    setTimeout(handleDisconnect, 200);
    console.log(err);
  } else {
    db = mongoUtil.getDb();
    let temp = [];
    console.log(result.length);
    result.forEach(async (element, ind) => {
      await sleep(1000 * ind);
      console.log(element.hash);
      web3.eth.getTransaction(element.hash, function (err, tx) {
        abiDecoder.addABI(ABI);
        //   console.log("kkkk",tx)
        if (
          tx?.input?.toString() != null &&
          tx?.input?.toString() != undefined
        ) {
          let tx_data = tx.input;
          let decoded_data = abiDecoder.decodeMethod(tx_data);
          let params = decoded_data.params;
          let param_values = [];
          for (i in params) {
            param_values.push(params[i].name + " : " + params[i].value);
          }
          var param1 = param_values[0].toString().split("to : ");
          var param2 = param_values[1].toString().split("amount : ");
          console.log(param1[1], param2[1]);
          var data = { address: param1[1], amount: param2[1] };
          db.collection("trxn").insertOne(data);
          temp.push(element);
          console.log(temp.length);
          if (element.length == result.length) {
            console.log("All Done");
          }
        }
      });
    });
  }
});

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

function handleDisconnect() {
  console.log("handleDisconnect()");

  mongoUtil.connectToServer(async function (err, client) {
    if (err) {
      setTimeout(handleDisconnect, 1000);
      return res
        .status(200)
        .json({ isConnected: true, error: true, message: "DB Error" });
    } else {
      console.log("Sid DB Connect Successfully");
    }
  });
}
