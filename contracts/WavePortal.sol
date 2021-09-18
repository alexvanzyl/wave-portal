// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    Message[] public messages;
    mapping(MessageType => uint256) public totalsByType;

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

    event NewMessage(address indexed from, uint256 timestamp, string body);

    constructor() {
        console.log("Wave or send beer :D");
    }

    function sendMessage(MessageType _messageType, string memory _body) public {
        totalsByType[_messageType] += 1;
        Message memory message = Message({
            from: msg.sender,
            messageType: _messageType,
            body: _body,
            timestamp: block.timestamp
        });

        messages.push(message);

        emit NewMessage(msg.sender, block.timestamp, _body);
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
