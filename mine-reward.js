    const {Blockchain, Transaction} = require('./blockchain');
    const EC = require('elliptic').ec;
    const ec = new EC('secp256k1');

    const myKey = ec.keyFromPrivate('1999be6a0b55e488da974b4b31e2bbeb6db38cdc6240df429c176e42660ed490');
    const myWalletAddress = myKey.getPublic('hex');

    var saveJeeCoin = new Blockchain();
    const tx1 = new Transaction(myWalletAddress, 'public key ', 10);
    tx1.signTransaction(myKey);
    saveJeeCoin.addTransaction(tx1);

    console.log('\n starting the miner...');
    saveJeeCoin.minePendingTransactions(myWalletAddress)

    console.log('\n Balance of xaiver is ', saveJeeCoin.getBalanceOfAddress(myWalletAddress));


    //https://www.youtube.com/watch?v=AQV0WNpE_3g