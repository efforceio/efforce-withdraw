// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GenesisProject is ERC721, Ownable {
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mintCollectionNFT(address collector, uint256 tokenId) public onlyOwner() {
        _safeMint(collector, tokenId);
    }
}
