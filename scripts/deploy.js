const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const WaveContract = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await WaveContract.deploy({
    value: hre.ethers.utils.parseEther("0.01"),
  });
  await waveContract.deployed();

  console.log("WavePortal address:", waveContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
