require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    i3MarketNetwork: {
      accounts: [
        "0x1dcc51a138fe79d3d49e131d8c7e104b712988813f073c25db95fc4f7ed4a192",
      ],
      url: "http://95.211.3.244:8545",
    },
  },
  solidity: "0.8.9",
};
