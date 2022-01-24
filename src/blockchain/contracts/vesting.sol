  // SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract tokenVesting is Ownable, Pausable {

    IERC20 public tokenToDistribute;

    uint256 public startTime;  
    uint256 public totalAllocations;  
    uint256 public totalDistributed;

    mapping (address => uint256) public userAllocation;   
    mapping (address => mapping(uint => bool)) public isStageClaimed;

    event stageClaimed (address user, uint amount, uint timestamp);
    event allocationSetted (address [] users, uint [] allocations, uint timestamp);
    event addedManualAllocation (address user, uint allocation, uint timestamp);
    event vestingFunded (uint amount, uint timestamp);
    
    constructor (address _tokenToDistribute, uint _startTime) {
        tokenToDistribute = IERC20(_tokenToDistribute);
        startTime = _startTime;
    }

    function claim (uint stage) external {
        require(stage >= 0 && stage <= 4, "Stage not valid");
        require(startTime + (stage * 7 days) <= block.timestamp, "Stage not ready to claim yet");
        require(!isStageClaimed[msg.sender][stage], "Stage already claimed");
        require(userAllocation[msg.sender] > 0, "user doesn't have allocation");

        uint256 amountToTranfer;    
        if(stage == 0){
            amountToTranfer = (amountToTranfer * 4000) / 10000;
        } else {
            amountToTranfer = (amountToTranfer * 1500) / 10000; 
        }

        isStageClaimed[msg.sender][stage] = true; 
        totalDistributed += amountToTranfer;  

        tokenToDistribute.transfer(msg.sender, amountToTranfer);    

        emit stageClaimed(msg.sender, amountToTranfer, block.timestamp);    
    }

    function setUserAllocation(address[] memory _users, uint[] memory _allocations) external onlyOwner {
        require(_users.length == _allocations.length, "Length mismatch");

        for(uint i = 0; i < _users.length; i++){
            require(userAllocation[_users[i]] == 0, "User is already added");

            userAllocation[_users[i]] = _allocations[i];
            totalAllocations += _allocations[i];
        }

        emit allocationSetted (_users, _allocations, block.timestamp);
    }

    function addManualAllocation(address _user, uint _allocation) external onlyOwner {
        userAllocation[_user] = userAllocation[_user] + _allocation;
        totalAllocations += _allocation;

        emit addedManualAllocation(_user, _allocation, block.timestamp);
    }

    function fundVesting (uint amount) external onlyOwner {        
        tokenToDistribute.transferFrom(msg.sender, address(this), amount);   

        emit vestingFunded (amount, block.timestamp); 
    }

    function tokensAvailable () public view returns (uint){
        return tokenToDistribute.balanceOf(address(this));
    }

    function tokensNotDelivered () public view returns (uint){
        return totalAllocations - totalDistributed;
    }

    function isFunded () external view returns (bool){
        return tokensAvailable() >= tokensNotDelivered();
    }

    function withdrawRemaining () external onlyOwner {
        uint remaining = tokenToDistribute.balanceOf(address(this));
        tokenToDistribute.transfer(msg.sender, remaining);
    }
}