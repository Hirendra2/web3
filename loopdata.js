// Example JSON arra
const fs = require("fs");
const web3 = require("web3");
const blockchain = "./blockchain.json";
var mongoUtil = require("./dbconfig");

async function getTotalAmountInEther(filename) {
  mongoUtil.connectToServer(async function (err, client) {
    db = mongoUtil.getDb();

  const rawData = fs.readFileSync(filename);
  const data = JSON.parse(rawData);
  let totalAmountInEther = 0;
  console.log(data.result.length)

  let count =0
  for (let i = 0; i <= data.result.length; i++) {   
    const element = data.result[i];
    console.log(element)
   const amountInWei = element.value;
   const amountInEther = web3.utils.fromWei(amountInWei, "ether");
   totalAmountInEther += parseFloat(amountInEther);
    console.log(totalAmountInEther)
    console.log(count++)
    var datas = {id:element.id,address:element.address, amount: amountInEther };
    await  db.collection("Fusd").insertOne(datas);
   console.log(datas)
   
 
  }
  if (count == data.length) {
    console.log("All Done");
  }
  return totalAmountInEther;
})
}

getTotalAmountInEther(blockchain)

// const totalAmount = getTotalAmountInEther("./Tokendata.json");
async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}