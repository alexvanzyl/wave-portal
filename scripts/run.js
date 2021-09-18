const hre = require("hardhat");

async function main() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const WaveContract = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await WaveContract.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });

  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // 0 = wave
  let tx = await waveContract.sendMessage(0, "hello there!");
  await tx.wait();

  const messages = await waveContract.getMessages();
  messages.forEach((message) => {
    console.log({
      from: message[0],
      messageType: message[1] === 0 ? "wave" : "beer",
      body: message[2],
      timestamp: message[3].toNumber(),
    });
  });

  console.log("Total waves: ", (await waveContract.getTotalFor(0)).toNumber());
  console.log("Total beers: ", (await waveContract.getTotalFor(1)).toNumber());

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
