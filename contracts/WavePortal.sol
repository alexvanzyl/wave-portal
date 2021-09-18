// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    Message[] public messages;
    mapping(MessageType => uint256) public totalsByType;
    mapping(address => uint256) public lastWavedAt;
    address public latestWinner;
    uint256 private seed;

    enum MessageType {
        Wave,
        Beer
    }

    struct Message {
        address from;
        MessageType messageType;
        string body;
        uint256 timestamp;
    }

    event NewMessage(
        address indexed from,
        uint256 timestamp,
        MessageType messageType,
        string body
    );

    constructor() payable {
        console.log("Wave or send beer :D");
    }

    function sendMessage(MessageType _messageType, string memory _body) public {
        require(
            lastWavedAt[msg.sender] + 3 minutes < block.timestamp,
            "Wait 3m"
        );

        lastWavedAt[msg.sender] = block.timestamp;

        totalsByType[_messageType] += 1;
        Message memory message = Message({
            from: msg.sender,
            messageType: _messageType,
            body: _body,
            timestamp: block.timestamp
        });

        messages.push(message);

        uint256 randomNumber = (block.difficulty + block.timestamp + seed) %
            100;
        console.log("Random # generated %s", randomNumber);

        seed = randomNumber;

        if (randomNumber < 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money then the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract");
            latestWinner = msg.sender;
        }

        emit NewMessage(msg.sender, block.timestamp, _messageType, _body);
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }

    function getTotalFor(MessageType _messageType)
        public
        view
        returns (uint256)
    {
        return totalsByType[_messageType];
    }
}
