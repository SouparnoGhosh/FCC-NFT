/* eslint-disable node/no-missing-import */
/* eslint-disable no-unused-expressions */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { network, deployments, ethers } from "hardhat";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
import { RandomIpfsNft, VRFCoordinatorV2Mock } from "../../typechain";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Random IPFS NFT Unit Tests", function () {
      let randomIpfsNft: RandomIpfsNft,
        deployer: SignerWithAddress,
        vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "randomipfs"]);
        randomIpfsNft = await ethers.getContract("RandomIpfsNft");
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
      });

      describe("constructor", function () {
        it("sets starting values correctly", async function () {
          const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0);
          const isInitialized = await randomIpfsNft.getInitialized();
          assert(dogTokenUriZero.includes("ipfs://"));
          assert.equal(isInitialized, true);
        });
      });
    });
