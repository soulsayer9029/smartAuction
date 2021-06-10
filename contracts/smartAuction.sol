pragma solidity >=0.4.22 <0.9.0;

contract smartAuction{
    address  public beneficiary;
    uint public auctionEndTime;

    address public highestBidder;
    uint public highestBid;

    mapping(address=>uint) pendingReturns;

    bool ended;
    event highestBidIncreased(address bidder,uint amount);
    event auctionEnded(address winner,uint amount);

    constructor(uint _biddingTime) public{
        beneficiary=msg.sender;
        auctionEndTime =block.timestamp + _biddingTime;
    }
    function bid()public payable{
        require(block.timestamp <=auctionEndTime,"Auction already ended");
        require(msg.value>highestBid,"You need to bid more money");
        if(highestBid!=0){
            pendingReturns[highestBidder]+=highestBid;
        }
        highestBid=msg.value;
        highestBidder=msg.sender;

        emit highestBidIncreased(highestBidder, highestBid);

    }
    function withdraw()public returns(bool){
        uint amount=pendingReturns[msg.sender];
        address payable withdrawer=payable(msg.sender);
        if(amount>0){
            pendingReturns[msg.sender]=0;
            if(!withdrawer.send(amount)){
                pendingReturns[msg.sender]=amount;
                return false;
            }
        }
        return true;
    }
    function auctionEnd() public{
        require(block.timestamp>auctionEndTime,"Auction not yet finished");
        require(!ended,"auctionEnd was called");

        ended=true;
        payable(beneficiary).transfer(highestBid);

        emit auctionEnded(highestBidder,highestBid);


    }
    function auctionAlreadyEnded() public view returns(bool){
        return ended;
    }
}