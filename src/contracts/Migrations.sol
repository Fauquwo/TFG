// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.9.0;

contract Migrations {
  address public owner = msg.sender;
  uint public last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }
  
  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}
