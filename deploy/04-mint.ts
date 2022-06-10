/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  BasicNft,
  DynamicSvgNft,
  RandomIpfsNft,
  VRFCoordinatorV2Mock,
} from "../typechain";

const mint: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network, ethers, deployments } = hre;
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // These functions can't work on their own. They have to deployed with the others.
  // These contracts can't be deployed alone here as they have no constructors.

  // Basic NFT
  log(`------------------------------------`);
  log(`Basic NFT`);
  const basicNft: BasicNft = await ethers.getContract("BasicNft", deployer);
  const basicMintTx = await basicNft.mintNft();
  await basicMintTx.wait(1);
  console.log(`Basic NFT index 0 tokenURI: ${await basicNft.tokenURI(0)}`);

  // Dynamic NFT
  log(`------------------------------------`);
  log(`Dynamic NFT`);
  const highValue = ethers.utils.parseEther("4000");
  const dynamicSvgNft: DynamicSvgNft = await ethers.getContract(
    "DynamicSvgNft",
    deployer
  );
  const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue);
  await dynamicSvgNftMintTx.wait(1);
  console.log(
    `Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`
  );

  // Random IPFS NFT
  log(`------------------------------------`);
  log(`Random IPFS NFT`);
  const randomIpfsNft: RandomIpfsNft = await ethers.getContract(
    "RandomIpfsNft",
    deployer
  );
  const mintFee = await randomIpfsNft.getMintFee();
  const randomIpfsNftMintTx = await randomIpfsNft.requestNft({
    value: mintFee.toString(),
  });
  const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);

  // eslint-disable-next-line no-async-promise-executor
  await new Promise<void>(async (resolve) => {
    setTimeout(resolve, 300000); // 5 minutes delay
    randomIpfsNft.once("NftMinted", async () => {
      resolve();
    });
    if (chainId === 31337) {
      const requestId =
        randomIpfsNftMintTxReceipt.events![1].args!.requestId.toString();
      const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock =
        await ethers.getContract("VRFCoordinatorV2Mock", deployer);
      await vrfCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        randomIpfsNft.address
      );
    }
  });
  console.log(
    `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`
  );
};

export default mint;
mint.tags = ["all", "mint"];
