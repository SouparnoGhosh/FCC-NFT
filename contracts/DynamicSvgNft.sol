// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

// Imports
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DynamicSvgNft is ERC721 {
    uint256 private s_tokenCounter;

    constructor(string memory lowSvg, string memory highSvg)
        ERC721("Dynamic SVG NFT", "DSN")
    {
        s_tokenCounter = 0;
    }

    function mintNft() public payable {
        uint256 tokenId = s_tokenCounter;
        _safeMint(msg.sender, tokenId);
        s_tokenCounter += 1;
    }
}
