const Web3 = require('web3');

const web3 = new Web3("https://fufi.finance/rpc");

const contractAddress = '0xaC6B3Cc6e6C3B44237C509a7C1E9cdeE8c82A891';
contractABI =
web3.eth.getCode(contractAddress, function(error, result) {
  if (!error) {
    const contractABI = ABI_JSON; // Replace with your contract's ABI
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log(`Contract name: ${contract.options.jsonInterface[0].name}`);
  } else {
    console.error(error);
  }
});
