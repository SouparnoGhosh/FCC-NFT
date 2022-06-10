/* eslint-disable no-unused-expressions */
/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import { assert, expect } from "chai";
import { network, deployments, ethers } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { DynamicSvgNft, MockV3Aggregator } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  lowSVGImageuri,
  highSVGimageUri,
  lowTokenUri,
  highTokenUri,
} from "../../constants";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Dynamic SVG NFT Unit Tests", function () {
      let dynamicSvgNft: DynamicSvgNft,
        deployer: SignerWithAddress,
        mockV3Aggregator: MockV3Aggregator;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "dynamicsvg"]);
        dynamicSvgNft = await ethers.getContract("DynamicSvgNft");
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator");
      });

      describe("constructor", () => {
        it("sets starting values correctly", async function () {
          const lowSVG = await dynamicSvgNft.getLowSVG();
          const highSVG = await dynamicSvgNft.getHighSVG();
          const priceFeed = await dynamicSvgNft.getPriceFeed();
          assert.equal(lowSVG, lowSVGImageuri);
          assert.equal(highSVG, highSVGimageUri);
          assert.equal(priceFeed, mockV3Aggregator.address);
        });
      });

      describe("mintNft", () => {
        it("emits an event and creates the NFT", async function () {
          const highValue = ethers.utils.parseEther("1"); // 1 dollar per ether
          await expect(dynamicSvgNft.mintNft(highValue)).to.emit(
            dynamicSvgNft,
            "CreatedNFT"
          );
          const tokenCounter = await dynamicSvgNft.getTokenCounter();
          assert.equal(tokenCounter.toString(), "1");
          const tokenURI = await dynamicSvgNft.tokenURI(0);
          assert.equal(tokenURI, highTokenUri);
        });
        it("shifts the token uri to lower when the price doesn't surpass the highvalue", async function () {
          const highValue = ethers.utils.parseEther("100000000"); // $100,000,000 dollar per ether. Maybe in the distant future this test will fail...
          const txResponse = await dynamicSvgNft.mintNft(highValue);
          await txResponse.wait(1);
          const tokenURI = await dynamicSvgNft.tokenURI(0);
          assert.equal(tokenURI, lowTokenUri);
        });
      });
    });
