// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IERC20 {

    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address _owner) external returns (uint256 balance);
}
