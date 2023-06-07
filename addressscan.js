const { ethers } = require("ethers");
var Web3 = require('web3');
const moment = require("moment");
var axios = require('axios');
const shortid = require('shortid');
var mongoUtil = require('./dbconfig');
var url = 'https://fufi.finance/rpc';
var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
const { Worker } = require('worker_threads')
var db;



    mongoUtil.connectToServer(async function (err, client) {
        if (err) {
            setTimeout(handleDisconnect, 1000);
            console.log(err);
        }
        else {
            db = mongoUtil.getDb();
            for (var j = 1459254; j < 1527774; j++) {
                console.log(j);
                await sleep(200);
                customHttpProvider.getBlockWithTransactions(j).then(async (data) => {
                    if (data.transactions.length > 0) {
                        console.log(data.transactions)
                        data.transactions.forEach(async (element, index) => {
                            if (element.to == '0xa7eb478f08de6155a6a66e11c927e60b6aeb1cf5') {
                                var amount = parseInt(element.value._hex, 16);
                                var base = Math.pow(10, 18)
                                
                                var finalamount = amount / base;
                                var json = { "address": element.from.toString().toLowerCase(), "amount": finalamount, "date": new Date(Date.now()), "blocknumber": element.blockNumber, "hash": element.hash }
                                db.collection('transactions').insertOne(json, function (err, result) {
                                    if (err)
                                        console.log(err)
                                    else
                                        console.log("txn saved in DB");
                                });

                                var rewardjson = {
                                    "address": element.from.toString().toLowerCase(),
                                    "blocks": j,
                                    "amount": finalamount,
                                    "date": new Date(Date.now()),
                                }
                                const user = await db.collection('recovery').findOne({ address: element.from.toString().toLowerCase() });
                                if (user) {
                                    db.collection('recovery').findOneAndUpdate({ "address": element.from.toString().toLowerCase() }, { $inc: { "amount": finalamount } }, function (err, doc) {
                                        if (err) { throw err; }
                                        else { console.log(element.from.toString().toLowerCase()) }
                                    });
                                } else {

                                    db.collection('recovery').insertOne(rewardjson, function (err, result) {
                                        if (err)
                                            console.log("recovery not saved in DB")
                                        else
                                            console.log("recovery saved in DB");
                                    });
                                }
                             }
                        });
                    }

                   
                    var queryResult = await db.collection("burn").aggregate([{ $group: { _id: "", TotalSum: { $sum: "$amount" } } }]).toArray();
                    console.log("TOTAL BURN TILL NOW >>", queryResult);
                    if (queryResult.length > 0) {
                        db.collection("burn").find({}).toArray(async function (err, result) {
                            if (err) throw err;
                            if (result.length > 0) {
                                console.log("TOTAL BURNER TILL NOW >>",result.length)
                                result.forEach(async (element, index) => {
                                    var avg = (element.amount * 100) / queryResult[0].TotalSum;
                                    var sendingAmount = ((70 * avg) / 100); 
                
                                    //console.log(element.address," >> ",avg," >> ",sendingAmount," >> ",element.amount );
                                    var totalrewardjson = { "address": element.address, "amount": sendingAmount, "date": new Date(Date.now()) };
                                    const user = await db.collection('totalrewards').findOne({ "address": { "$regex": element.address, "$options": "i" } });
                                    if (user) {
                                        db.collection('totalrewards').findOneAndUpdate({ "address": { "$regex": element.address, "$options": "i" } }, { $inc: { "amount": sendingAmount } }, function (err, doc) {
                                            if (err) { throw err; }
                                            else { }
                                        });
                                    } else {
                                        db.collection('totalrewards').insertOne(totalrewardjson, function (err, result) {
                                            if (err) {
                                                console.log("err", err)
                                            }
                                        });
                                    }

                                    

                                    var jsonpercentage = {
                                        "address": element.address,
                                        "avg": avg,
                                        "reward": sendingAmount,
                                        "amount": element.amount
                                    };

                                    const percentagerecord = await db.collection('latestpercentage').findOne({ "address": { "$regex": element.address, "$options": "i" } });
                                    if (percentagerecord) {
                                        db.collection('latestpercentage').findOneAndUpdate({ "address": { "$regex": jsonpercentage.address, "$options": "i" } }, { $set: { avg: jsonpercentage.avg, reward: jsonpercentage.reward, amount: jsonpercentage.amount } }, { upsert: true }, function (err, doc) {
                                            if (err) { throw err; }
                                            else { }
                                        });
                                    } else {
                                        db.collection('latestpercentage').insertOne(jsonpercentage, function (err, result) {
                                            if (err) {
                                                console.log("err", err)
                                            }
                                        });
                                    }
                                });
                             }
                        });
                    }
                });
            }
        }
    });


async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}


function handleDisconnect() {
    console.log('handleDisconnect()');

    mongoUtil.connectToServer(async function (err, client) {
        if (err) {
            setTimeout(handleDisconnect, 1000); 
            return res.status(200).json({ isConnected: true, error: true, message: 'DB Error' });
            
        }
        else {
            console.log("Sid DB Connect Successfully");
        }
    });




}
