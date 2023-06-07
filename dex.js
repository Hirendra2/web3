var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
const fs = require("fs");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
require("dotenv").config();
const axios = require("axios");

const abiFactory = fs.readFileSync("./abis/Factory.json", "utf-8");
const abipair = fs.readFileSync("./abis/pair.json", "utf-8");

async function getallPairs() {
  return new Promise(async (resolve, reject) => {
    let pair = [];
    const abiFactorys = JSON.parse(abiFactory);
    var contract = new web3.eth.Contract(abiFactorys, process.env.Factory);
    await contract.methods
      .allPairsLength()
      .call()
      .then(async (r) => {
        console.log("allPairsLength", r);
        for (let i = 0; i < r; i++) {
          await sleep(10);
          await contract.methods
            .allPairs(i)
            .call()
            .then(async (re) => {
              pair.push(re);
            })
            .catch(async (e) => {
              console.log("ggggggggggg", e);
            });
        }
        if (r == pair.length) {
          resolve(pair);
          console.log(pair)
        }
      })
      .catch(async (e) => {
        console.log(e);
        reject();
      });
  });
}

let useraddress = "0x3DC28D7C9c5c2fF45aB3CF79B9e361dA912a5174";

async function getTokenPair() {
  return new Promise(async (resolve, reject) => {
      let Data = [];
      let TestData = [];
      const abipairs = JSON.parse(abipair);

      await getallPairs()
          .then(async (r) => {
              const getToken = Object.values(r);
              let Totalpair = r.length;
              console.log("Totalpair", Totalpair);
              getToken.forEach(async (address) => {
                  await sleep(10);
                  var contract = new web3.eth.Contract(abipairs, address);
                  await contract.methods.token0().call().then(async (token0) => {
                      await contract.methods.token1().call().then(async (token1) => {
                          await contract.methods.totalSupply().call().then(async (totalSupply) => {
                              await contract.methods.balanceOf(useraddress).call().then(async (liqudity) => {
                                  await contract.methods.getReserves().call().then(async (Reserves) => {
                                      await getTokendetails(token0).then(async (Token1detail) => {
                                          await getTokendetails(token1).then(async (Token2detail) => {
                                              let totalSupplys = Web3.utils.fromWei(totalSupply, 'ether');
                                              let _reserve01 = Web3.utils.fromWei(Reserves._reserve0, 'ether');
                                              let _reserve02 = Web3.utils.fromWei(Reserves._reserve1, 'ether');
                                              let liquditys = Web3.utils.fromWei(liqudity, 'ether');
                                              let userLp1 = (liquditys / totalSupplys) * _reserve01;
                                              let userLp2 = (liquditys / totalSupplys) * _reserve02;
                                              await TestData.push(userLp1);
                                            //  console.log(totalSupplys,liquditys,_reserve02)
                                              if (userLp1!= 0) {
                                                let aa = [userLp1, userLp2, Token1detail, Token2detail];
                                                await Data.push(aa);
                                            }
                                        }).catch(async (e) => {
                                            console.log(e);
                                        });
                                    }).catch(async (e) => {  
                                        console.log(e);
                                    });
                                }).catch(async (e) => {
                                    console.log(e);
                                });
                            })
                                .catch(async (e) => {
                                    console.log(e);
                                });
                        })
                            .catch(async (e) => {
                                console.log(e);
                            });
                          
                        if (TestData.length == Totalpair) {
                            console.log("Data", Data);
                            resolve(Data);
                        }
                    })
                        .catch(async (e) => {
                            console.log(e);
                        });
                })
                    .catch(async (e) => {
                        console.log(e);
                    });
            });
        })
        .catch(async (e) => {
            console.log(e);
            reject();
        });
});
}



async function getTokendetails(token) {
  return new Promise(async (resolve, reject) => {

var data = JSON.stringify({
  address: token,
});

var config = {
  method: "get",
  url: "https://fufiscan.com/api?module=token&action=getToken&contractaddress="+token,
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};

await axios(config)
  .then(async function (response) {
    resolve(response.data.result.name)
  }).catch(async (e) => {
    console.log(e);
    reject(e)
  });
}).catch(async (e) => {
  console.log(e);
 
});
}



getTokenPair();
async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
