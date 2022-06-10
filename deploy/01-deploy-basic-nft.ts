/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import verify from "../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config";

const deployBasicNft: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, network } = hre;
  const { log, deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;
  log(`--------------------------------------`);
  const _args: any[] = [];
  const basicNft = await deploy("BasicNft", {
    contract: "BasicNft",
    from: deployer,
    args: _args,
    log: true,
    waitConfirmations: waitBlockConfirmations || 1,
  });

  // verifying the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log(`Verifying contract_________________`);
    await verify(basicNft.address, _args);
  }
};

export default deployBasicNft;
deployBasicNft.tags = ["all", "main"];
