const { expect } = require("chai");
const { ethers } = require("hardhat");
const { ContractFunctionVisibility } = require("hardhat/internal/hardhat-network/stack-traces/model");

describe("DataSharingAgreement", function () {
  it("Should create agreement and emit an event", async function () {
    const DataSharingAgreement = await ethers.getContractFactory("DataSharingAgreement");
    const dataSharingAgreement = await DataSharingAgreement.deploy();
    await dataSharingAgreement.deployed();

    const createAgreement = await dataSharingAgreement.createAgreement(123, "purpose", "123", "456", [1, 356604033949585], [true, true, true], [true, true, true, true], true);
    // wait until the transaction is mined
    await createAgreement.wait();
    const agreement = await dataSharingAgreement.agreements(123);
    console.log(agreement);

    ((await dataSharingAgreement.agreements).length) == 0;
  });
});
