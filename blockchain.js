const SHA56 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor (fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount
    }

    calculateHash(){
        return SHA56(this.fromAddress+this.toAddress+this.amount).toString();
    }

    signTransaction(signingKey){

        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error("You cannot sign Transactions for other wallets!");
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64')
        this.signature = sig.toDER('hex')
    }

    isValid(){

        if(this.fromAddress === null) return true;
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transactions');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = ""
        this.nonce = 0

    }

    calculateHash(){
        return SHA56(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)+ this.nonce).toString();
    }

    mineBLock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++
            this.hash = this.calculateHash();
        }

        console.log("Block mined "+this.hash);
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }

}

class Blockchain{
  constructor(){
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 4;
      this.pendingTransactions = [];
      this.miningReward = 100;
  }    

  createGenesisBlock(){
      return new Block("01/01/2017", "Genesis Block", "0")
  }

  getLatestBLock(){
      return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress){
    let block  = new Block(Date.now, this.pendingTransactions);
    block.mineBLock(this.difficulty);
    console.log("Block successfully mined");
    this.chain.push(block);

    this.pendingTransactions = [
        new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

 addTransaction(transaction){
    if(!transaction.fromAddress || !transaction.toAddress){
        throw new Error("Transaction must include from and to address");
    }

    if(!transaction.isValid()){
        throw new Error("Cannot add invalid transaction to chain");
    }

    this.pendingTransactions.push(transaction)
 }

 getBalanceOfAddress(address){
    let balanace = 0;
    for(const block of this.chain){
        for(const trans of block.transactions){
            if(trans.fromAddress === address){
                balanace -= trans.amount
            }
            if(trans.toAddress === address){
                balanace += trans.amount
            }
        }
    }
    return balanace;
 }

 isChainVBalid(){
      for(let i=1; i < this.chain.length; i++){
          const currentBLock = this.chain[i];
          const previousBlock = this.chain[i - 1]

          if(!currentBLock.hasValidTransactions()){
              return false;
          }

          if(currentBLock.hash !== currentBLock.calculateHash()){
              return false;
          }

          if(currentBLock.previousHash !== previousBlock.hash){
              return false;
          }
      }
      return true;
  }


}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;