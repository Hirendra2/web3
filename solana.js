const { Keypair, Connection, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');

const endpoint = 'https://api.mainnet-beta.solana.com';

const privateKey = 'geCdRBzK97X49otUKUWRpfufuDBQwF5X6LS2xZ7cCRwmykHRViMv8DR2uTXkSdRSfjBBC71rPohjBZDFFmseQsT';

const recipientPublicKey = '7XfqYCijHXpKxHiH5RrzuCZjM4qsnTcPvb3zMTQ7bAA3';

const amountSOL = 1;

async function sendSol() {
  try {

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: .publicKey,
        toPubkey: recipientPublicKey,
        lamports: amountSOL * 1000000000, 
      })
    );

    transaction.feePayer = senderKeypair.publicKey;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.sign(senderKeypair);

    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

    console.log('Transaction confirmed. Signature:', signature);
  } catch (error) {
    console.error('Error sending SOL:', error);
  }
}

sendSol();
