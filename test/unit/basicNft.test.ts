/* eslint-disable node/no-missing-import */
/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import {
  developmentChains /* networkConfig */,
} from "../../helper-hardhat-config";
import { ethers, network, deployments } from "hardhat";
import { BasicNft } from "../../typechain";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT Unit Tests", function () {
      let basicNft: BasicNft;
      // eslint-disable-next-line no-unused-vars
      let deployer;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "basicNft"]);
        basicNft = await ethers.getContract("BasicNft");
      });

      it("Allows users to mint an NFT, and updates appropriately", async function () {
        const txResponse = await basicNft.mintNft();
        await txResponse.wait();
        const tokenURI = await basicNft.tokenURI(0);
        const tokenCounter = await basicNft.getTokenCounter();

        expect(await basicNft.TOKEN_URI()).to.eq(tokenURI);
        expect(tokenCounter.toString()).to.eq("1");
      });
    });
