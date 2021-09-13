// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint256) waveCounts;

    constructor() {
        console.log("Wave to say hi :)");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s just waved!", msg.sender);
        waveCounts[msg.sender] += 1;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }

    function getWaveCount(address _address) public view returns (uint256) {
        console.log("%s has waved %d times!", _address, waveCounts[_address]);
        return waveCounts[_address];
    }
}
