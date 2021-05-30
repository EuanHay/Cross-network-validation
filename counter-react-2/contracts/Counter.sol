/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.6.8;

contract Counter {

    event CountIncremented(uint256 count, address userAddress);

    uint256 count = 0;

    function incrementCounter() public {
        count += 1;
        emit CountIncremented(count, msg.sender);
    }
    function getCount() public view returns (uint256) {
        return count;
    }
}
