import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Currency, EfforceWithdraw, GenesisProject } from "../typechain-types";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("Efforce contract", function () {
    let
        genesis1: GenesisProject,
        genesis2: GenesisProject,
        currency: Currency,
        efforce: EfforceWithdraw,
        owner: SignerWithAddress,
        account1: SignerWithAddress,
        account2: SignerWithAddress;

    const
        refund1 = 10,
        refund2 = 20,
        totalSupply = 100,
        firstTransfer = 30,
        secondTransfer = 50;

    before("deploy contracts", async function () {
        [owner, account1, account2] = (await ethers.getSigners());

        const Currency = await ethers.getContractFactory("Currency");
        currency = await Currency.deploy(totalSupply);
        await currency.deployed();

        const Genesis1 = await ethers.getContractFactory("GenesisProject");
        genesis1 = await Genesis1.deploy("Genesis 1", "GNS1");
        await genesis1.deployed();

        const Genesis2 = await ethers.getContractFactory("GenesisProject");
        genesis2 = await Genesis2.deploy("Genesis 2", "GNS2");
        await genesis2.deployed();

        const Efforce = await ethers.getContractFactory("EfforceWithdraw");
        efforce = await Efforce.deploy(genesis1.address, refund1, genesis2.address, refund2, currency.address, [account1.address], [refund1]);
        await efforce.deployed();
    });

    it("owner has minted tokens", async function () {
        expect(
            await currency.balanceOf(owner.address)
        ).to.equal(totalSupply);
    });

    it("tokens moved to the smart contract", async function () {
        await currency.transfer(efforce.address, firstTransfer);

        expect(
            await currency.balanceOf(efforce.address)
        ).to.equal(firstTransfer);
    });

    it("crates nfts for genesis projects", async function () {
        await genesis1.mintCollectionNFT(owner.address, 1);
        expect(
            await genesis1.ownerOf(1)
        ).to.equal(owner.address);

        await genesis2.mintCollectionNFT(owner.address, 1);
        expect(
            await genesis2.ownerOf(1)
        ).to.equal(owner.address);
    });

    it("transfers nfts to efforce contract and check balances", async function () {
        await genesis1['safeTransferFrom(address,address,uint256)'](owner.address, efforce.address, 1);

        expect(
            await genesis1.ownerOf(1)
        ).to.equal(efforce.address);

        expect(
            await currency.balanceOf(owner.address)
        ).to.equal(totalSupply - refund2);

        await genesis2['safeTransferFrom(address,address,uint256)'](owner.address, efforce.address, 1);

        expect(
            await genesis2.ownerOf(1)
        ).to.equal(efforce.address);

        expect(
            await currency.balanceOf(owner.address)
        ).to.equal(totalSupply);
    });

    it("withdraws amount", async function() {
        const partialTransfer = 25;
        await currency.transfer(efforce.address, secondTransfer);
        await efforce["withdraw(address,uint256)"](account1.address, partialTransfer);

        expect(await currency.balanceOf(account1.address)).to.equal(partialTransfer);
        await expect(efforce.connect(account2)["withdraw(address,uint256)"](account1.address, partialTransfer)).to.be.reverted;

        await expect(efforce.connect(account2)["withdraw(address,uint256)"](account1.address, partialTransfer)).to.be.reverted;
        await efforce["withdraw(address)"](account1.address);
        expect(await currency.balanceOf(account1.address)).to.equal(secondTransfer);
    });

    it("reverts if not enough funds", async function() {
        await genesis1.mintCollectionNFT(owner.address, 2);
        await expect(genesis1['safeTransferFrom(address,address,uint256)'](owner.address, efforce.address, 2)).to.be.reverted;
    });

    it("changes contract owner", async function() {
        await expect(efforce.updateManager(account2.address)).to.not.be.reverted;
        expect(await efforce.contractManager()).to.be.equal(account2.address);
    });

    it("can refund without nft", async function() {
        await currency.transfer(efforce.address, refund1);
        await expect(efforce.connect(account2).receiveRefund()).reverted;
        expect(await efforce.getRefundAmount(account1.address)).equal(refund1);
        const before = await currency.balanceOf(account1.address);
        await expect(efforce.connect(account1).receiveRefund()).not.reverted;
        const after = await currency.balanceOf(account1.address);
        expect(after.sub(before)).equal(refund1);
        expect(await efforce.getRefundAmount(account1.address)).equal(0);
    });
});

