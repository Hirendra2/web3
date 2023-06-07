
const EthereumTx = require('ethereumjs-tx').Transaction;
var Web3 = require('web3');
const axios = require('axios');

const web3 = new Web3(Web3.givenProvider || "https://fufi.finance/rpc")



async function TokenTransfer(myAddress,privateKey,destAddress,transferAmount,contractAddress) {
    
    console.log(`web3 version: ${web3.version}`)
    
    var count = await web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
   
    var abiArray = [
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_x",
            "type": "uint256"
          }
        ],
        "name": "set",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "get",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "x",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ];
    
    
    var contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: myAddress
    });
    
    var balance = await contract.methods.get().call();
    console.log(`Balance before send: --------------`,balance);
    
    var chainID =await web3.eth.net.getId();
    console.log(`ChainID: ${chainID}\n------------------------`);


    var gasPrices = await getCurrentGasPrices();
    var gasPriceGwei=gasPrices.low;
    console.log('gasPriceGwei',gasPriceGwei);
    var gasLimit = 800000;
    console.log('gasLimit',gasLimit)
    
    var rawTransaction = {
        "from": myAddress,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(gasPriceGwei * 1e9),
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": contractAddress,
        "value": "0x0",
        "data": contract.methods.set(destAddress).encodeABI(),
        "chainId": chainID
    };
    console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`);
    
    const signPromise = web3.eth.accounts.signTransaction(rawTransaction, privateKey);
    
    signPromise.then((signedTx) => {
     
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
          console.log("https://fufiscan.com/tx/"+receipt.transactionHash);
        });
        sentTx.on("error", err => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });


};

async function getCurrentGasPrices() {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    };
    return prices;
}

TokenTransfer("0x5Ac32b12daF2D5942403D3fc97f168Fa485C795C","6a9cdaafc795b70dd6e700502de3d37d7dd77c1fb76198eff77a270d1c412a77","6565656556","65890000000000006","0x3dE7088762ba8Ebdf0701A6962DeB4C8AB1E9B4d")

