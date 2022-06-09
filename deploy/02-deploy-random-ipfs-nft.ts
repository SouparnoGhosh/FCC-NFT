// ESLint Ignore Statements
/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */

import {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  networkConfig,
} from "../helper-hardhat-config";
import verify from "../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { VRFCoordinatorV2Mock } from "../typechain";
import { BigNumberish } from "@ethersproject/bignumber";
import { storeImages, storeTokeUriMetadata } from "../utils/uploadToPinata";

const FUND_AMOUNT = "1000000000000000000000";
const imagesLocation = "./images/randomNft/";
let tokenUris = [
  "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
  "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
  "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
];

// Meta Data Template
const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
};

const deployRandomIpfsNft: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId!;
  let vrfCoordinatorV2Address: string, subscriptionId: BigNumberish | string;

  // If we need to upload the images to Pinata, handleTokenUris will run
  if (process.env.UPLOAD_TO_PINATA === "true") {
    tokenUris = await handleTokenUris();
  }

  if (chainId === 31337) {
    // create VRFV2 Subscription
    const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait();
    subscriptionId = transactionReceipt.events![0].args!.subId;
    // Fund the subscription
    // Our mock makes it so we don't actually have to worry about sending fund
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2!;
    subscriptionId = networkConfig[chainId].subscriptionId!;
  }

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log(`Random IPFS NFT Deployed!`);
  log("----------------------------------");
  const constructorArgs = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane!,
    networkConfig[chainId].mintFee!,
    networkConfig[chainId].callbackGasLimit!,
    tokenUris,
  ];

  // Deploy the contract
  const randomIpfsNft = await deploy("RandomIpfsNft", {
    from: deployer,
    args: constructorArgs,
    log: true,
    waitConfirmations: waitBlockConfirmations || 1,
  });
  log("----------------------------------");

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(randomIpfsNft.address, constructorArgs);
  }
};

async function handleTokenUris() {
  const tokenUris: any[] = [];

  return tokenUris;
}

export default deployRandomIpfsNft;
deployRandomIpfsNft.tags = ["all", "randomipfs", "main"];
