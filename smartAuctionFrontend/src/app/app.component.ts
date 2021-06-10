import {  Component,OnInit } from '@angular/core';
import  Web3 from 'web3';
import { AbiItem } from 'web3-utils'



declare let window: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'smartAuctionFrontend';
  public isLoading = false;
  declare window: any;

  public highestBid = 0;
  public auctionAlreadyEnded: boolean=false;
  
  public CurrentAccount:any;
  private web3: Web3;
  private smartAuction: any;
  private accounts: any[]=[];
  private ethPrecision = 10 ** 18;
  private highestBidder:any;

  readonly contractAbi=[
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_biddingTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "auctionEnded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "bidder",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "highestBidIncreased",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "auctionEndTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "beneficiary",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "highestBid",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "highestBidder",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "bid",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "auctionEnd",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "auctionAlreadyEnded",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]
  readonly contractAddress='0xe5f2199b43c4Cc05c09767d845859BEEA81b7288'
  constructor(){
    this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    if(window.ethereum){
      window.web3=new Web3(window.ethereum);
      window.ethereum.enable().then((a:any)=>{
        this.CurrentAccount=a[0];
      });
    }else if(window.web3){
      window.web3=new Web3(window.web3.currentProvider)
    }else{
      window.alert("Non-Ethereum Browser detected,you should consider using meta-mask")
    }
    
  }
  async ngOnInit(){
    try{
          // console.log(typeof(this.contractAbi))
      this.isLoading=true;
      
      this.smartAuction=new this.web3.eth.Contract(this.contractAbi as AbiItem[],this.contractAddress);
      
      
      const that=this
      
      window.ethereum.on('accountsChanged', function () {
        window.ethereum.enable().then((a:any)=>{
          that.CurrentAccount=a[0];
        });
      });
      this.CurrentAccount=that.CurrentAccount
     
      await this.fetchCurrentValues();
    }catch(e){
      console.log(e);
      alert("Internal Error Occured")
    }finally{
      this.isLoading=false;
    }
  }
  public async fetchCurrentValues(){
    try{
      this.isLoading=true;

      this.highestBid=await this.smartAuction.methods.highestBid().call()/this.ethPrecision;
      
      this.auctionAlreadyEnded=await this.smartAuction.methods.auctionAlreadyEnded().call();

    }catch(e){
      console.log(e);
      alert("connection failed")
    }finally{
      this.isLoading=false;
    }
  }
  
  
  
  public async bid(bid:any){
    try{
      this.isLoading=true;

      // console.log(this.accounts[0])
      window.ethereum.enable().then((a:any)=>{
        this.CurrentAccount=a[0];
      });

      const bidResult = await this.smartAuction.methods.bid().send({ from: this.CurrentAccount, value: Number(bid) * this.ethPrecision });

      console.log(bidResult)
      console.log(this.accounts[0])

      await this.fetchCurrentValues()
      
      alert('bid was made');
    }catch(e){
      console.log(e);
      alert("Something Went wrong");
    }finally{
      this.isLoading=false;
    }
  }
  public async withdraw() {
    try {
      this.isLoading = true;
      window.ethereum.enable().then((a:any)=>{
        this.CurrentAccount=a[0];
      });
      const withdrawResult = await this.smartAuction.methods.withdraw().send({ from: this.CurrentAccount });

      console.log('withdrawResult', withdrawResult);

      if (!withdrawResult) {
        alert('An error while withdrawing your funds occured - please try again.');
        console.log("An error while withdrawing your funds occured - please try again.");
      } else {
        alert('Your withdrawal has been finished successfully.');
      }
      await this.fetchCurrentValues()
    } catch (ex) {
      console.error("exception while withdrawing", ex);
      alert('An internal error while withdrawing your funds occured - please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  public async end() {
    try {

      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.highestBidder=await this.smartAuction.methods.highestBidder().call();
      await this.smartAuction.methods.auctionEnd().send({ from:this.highestBidder  });

      alert('The auction is over now - thanks for using our service ;)');

      await this.fetchCurrentValues();
    } catch (ex) {
      console.error("exception during ending", ex);

      alert('An error while ending the auction occured - please try again.');
    } finally {
      this.isLoading = false;
    }
  }
    
  
  
  
 
  
}
