// const { expect } = require("chai");
const chai = require("chai");
const should = chai.should();
// const { ethers } = require("hardhat");
// const { ContractFunctionVisibility } = require("hardhat/internal/hardhat-network/stack-traces/model");

describe("DataSharingAgreement", function () {
  it("Should create agreement and emit an event", async function () {
    const DataSharingAgreement = await ethers.getContractFactory("DataSharingAgreement");
    const dataSharingAgreement = await DataSharingAgreement.deploy();
    await dataSharingAgreement.deployed();

    const createAgreementTx = await dataSharingAgreement.createAgreement(123, "purpose", "123", "456", [1, 356604033949585], [true, true, true], [true, true, true, true], true);
    // wait until the transaction is mined
    await createAgreementTx.wait();
    // const agreement = await dataSharingAgreement.agreements(0);
    // console.log(agreement);
    // const agreements = await dataSharingAgreement.getAgreements();
    // console.log(agreements);
    const agreementsLength = await dataSharingAgreement.getAgreementsLength();

    agreementsLength.should.equal(1);
  });
});
