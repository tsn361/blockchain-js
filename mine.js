const SHA56 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
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
}

class Blockchain{
  constructor(){
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 4;
  }    

  createGenesisBlock(){
      return new Block(0, "01/01/2017", "Genesis Block", "0")
  }

  getLatestBLock(){
      return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBLock().hash;
    //newBlock.hash = newBlock.calculateHash();
    newBlock.mineBLock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainVBalid(){
      for(let i=1; i < this.chain.length; i++){
          const currentBLock = this.chain[i];
          const previousBlock = this.chain[i - 1]

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

  var saveJeeCoin = new Blockchain();
  console.log("Mining block 1 ....");
  saveJeeCoin.addBlock(new Block(1, "10/07/2021", {amount: 4}));
  console.log("Mining block 2 ....");
  saveJeeCoin.addBlock(new Block(2, "11/07/2021", {amount: 8}));

  console.log("is blockchain valid? ", saveJeeCoin.isChainVBalid());
