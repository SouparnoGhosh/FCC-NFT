/* eslint-disable no-unused-expressions */
/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import { assert, expect } from "chai";
import { network, deployments, ethers } from "hardhat";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
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
    });
