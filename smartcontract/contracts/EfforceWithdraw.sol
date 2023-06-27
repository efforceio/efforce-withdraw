// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IERC721TokenReceiver.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IEfforceWithdraw.sol";

contract EfforceWithdraw
    is IERC721TokenReceiver, IEfforceWithdraw
{
    bytes4 private constant MAGIC_ON_ERC721_RECEIVED = 0x150b7a02;

    address public immutable GENESIS_PROJECT_1; // 0xC849AD758bF4F69A087Ce0dF164b3a4F28f4B49C;
    address public immutable GENESIS_PROJECT_2; // 0x6cC885Ca0E488f42a9397f923C53B270E2a728de;

    uint256 public immutable REFUND_1; // = 10;
    uint256 public immutable REFUND_2; // = 10;

    address public immutable REFUND_TOKEN; // = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;

    address public contractManager;

    mapping(address=>uint256) private accountToRefund;

    string constant private permissionError = "Permission denied";
    string constant private tokenNotSupported = "This token is not supported";
    string constant private refundNotAvailable = "Refund not available";

    constructor(
        address genesisProject1,
        uint256 refund1,
        address genesisProject2,
        uint256 refund2,
        address refundTokenAddress,
        address[] memory accounts,
        uint256[] memory refunds
    )
    {
        require(accounts.length == refunds.length);

        GENESIS_PROJECT_1 = genesisProject1;
        REFUND_1 = refund1;
        GENESIS_PROJECT_2 = genesisProject2;
        REFUND_2 = refund2;
        REFUND_TOKEN = refundTokenAddress;
        contractManager = msg.sender;

        for (uint i = 0; i < accounts.length; i++) {
            accountToRefund[accounts[i]] = refunds[i];
        }
    }

    function onERC721Received(address, address _from, uint256, bytes calldata)
        external
        override
        returns(bytes4)
    {
        require(msg.sender == GENESIS_PROJECT_1 || msg.sender == GENESIS_PROJECT_2, tokenNotSupported);

        uint256 refund;

        if (msg.sender == GENESIS_PROJECT_1) {
            refund = REFUND_1;
        } else {
            refund = REFUND_2;
        }

        IERC20(REFUND_TOKEN).transfer(_from, refund);

        return MAGIC_ON_ERC721_RECEIVED;
    }

    function withdraw(address beneficiary, uint256 amount)
        external
        override
    {
        require(msg.sender == contractManager, permissionError);
        IERC20(REFUND_TOKEN).transfer(beneficiary, amount);
        emit WithdrawSent(beneficiary, amount);
    }

    function withdraw(address beneficiary)
        external
        override
    {
        require(msg.sender == contractManager, permissionError);
        uint256 amount = IERC20(REFUND_TOKEN).balanceOf(address(this));
        IERC20(REFUND_TOKEN).transfer(beneficiary, amount);
        emit WithdrawSent(beneficiary, amount);
    }

    function updateManager(address account)
        external
        override
    {
        require(msg.sender == contractManager, permissionError);
        contractManager = account;
    }

    function getRefundAmount(address account)
        external
        override
        view
        returns(uint256)
    {
        return accountToRefund[account];
    }

    function receiveRefund()
        external
        override
    {
        require(accountToRefund[msg.sender] > 0, refundNotAvailable);
        IERC20(REFUND_TOKEN).transfer(msg.sender, accountToRefund[msg.sender]);
        accountToRefund[msg.sender] = 0;
        emit RefundSent(msg.sender, accountToRefund[msg.sender]);
    }
}
