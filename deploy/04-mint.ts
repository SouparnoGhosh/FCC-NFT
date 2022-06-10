/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const mint: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network, ethers, deployments } = hre;
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  log(`------------------------------------`);

  log(`Bal`);

  // These functions can't work on their own. They have to deployed with the others.
  // These contracts can't be deployed alone here as they have no constructors.

  // Basic NFT
  const basicNft = await ethers.getContract("BasicNft", deployer);
  const basicMintTx = await basicNft.mintNft();
  await basicMintTx.wait(1);
};

export default mint;
mint.tags = ["all", "mint"];
