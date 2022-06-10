// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

// Imports
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721 {
    // Variables
    uint256 private s_tokenCounter;
    string private s_lowImageURI;
    string private s_highImageURI;
    // mapping(uint256 => int256) private s_tokenIdToHighValues;
    // AggregatorV3Interface internal immutable i_priceFeed;

    // Events
    event CreatedNFT(uint256 indexed tokenId, int256 highValue);

    // Constructor
    constructor(string memory lowSvg, string memory highSvg)
        ERC721("Dynamic SVG NFT", "DSN")
    {
        s_tokenCounter = 0;
        s_lowImageURI = svgToImageURI(lowSvg);
        s_highImageURI = svgToImageURI(highSvg);
    }

    // Functions
    function mintNft() public payable {
        uint256 tokenId = s_tokenCounter;
        _safeMint(msg.sender, tokenId);
        s_tokenCounter += 1;
    }

    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    function getLowSVG() public view returns (string memory) {
        return s_lowImageURI;
    }

    function getHighSVG() public view returns (string memory) {
        return s_highImageURI;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
