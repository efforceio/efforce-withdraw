// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IEfforceWithdraw {

    /**
        @notice Withdraw funds from the smart contract to the beneficiary address.
        @dev Callable only by contract manager.
        @param beneficiary Account receiving the funds.
        @param amount The amount that will be withdrawn.
    */
    function withdraw(address beneficiary, uint256 amount) external;

    /**
        @notice Withdraw all the funds from the smart contract to the beneficiary address.
        @dev Callable only by contract manager.
        @param beneficiary Account receiving the funds.
    */
    function withdraw(address beneficiary) external;

    /**
        @notice Update the address of the contract manager.
        @dev Callable only bt contract manager.
        @param account New contract manager.
    */
    function updateManager(address account) external;

    /**
        @notice Get the amount that can be refunded by an account
        @param account The input account.
    */
    function getRefundAmount(address account) external view returns(uint256);

    /**
        @notice If the amount to be refund is greater than zero, the amount is transferred from the smart contract to the sender address.
    */
    function receiveRefund() external;

    event WithdrawSent(address to, uint256 amount);
    event RefundSent(address to, uint256 amount);
}
