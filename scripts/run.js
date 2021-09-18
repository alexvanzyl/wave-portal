const hre = require("hardhat");

async function main() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const WaveContract = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await WaveContract.deploy();

  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by:", owner.address);

  // 0 = wave
  let tx = await waveContract.sendMessage(0, "hello there!");
  await tx.wait();

  // 1 = beer
  let tx2 = await waveContract.sendMessage(1, "hello there, again!");
  await tx2.wait();

  let tx3 = await waveContract.sendMessage(1, "Me like beer!");
  await tx3.wait();

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
