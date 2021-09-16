// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    enum MessageType {
        Wave,
        Beer
    }

    struct Message {
        MessageType messageType;
        string body;
    }

    mapping(MessageType => uint256) public totalsByType;
    Message[] public messages;

    constructor() {
        console.log("Wave or send beer :D");
    }

    function sendMessage(MessageType _messageType, string memory _body) public {
        Message memory message = Message({
            messageType: _messageType,
            body: _body
        });

        messages.push(message);
        totalsByType[_messageType] += 1;
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
