const { expect, assert } = require('chai')
const chai = require('chai')
const should = chai.should()
//const { ethers } = require("hardhat");
// const { ContractFunctionVisibility } = require("hardhat/internal/hardhat-network/stack-traces/model");

describe('Agreement contract', function () {
  let DataSharingAgreement
  let dataSharingAgreement
  it('Deploy contract', async function () {
    DataSharingAgreement = await ethers.getContractFactory(
      'DataSharingAgreement',
    )
    dataSharingAgreement = await DataSharingAgreement.deploy()
    await dataSharingAgreement.deployed()
  });

  describe('Create DataSharingAgreement', function () {
    it('Should create agreement and emit an event', async function () {
      const createAgreementTx = await dataSharingAgreement.createAgreement(
        '123',
        'purpose',
        '123',
        '456',
        [1, 356604033949585],
        ["dataType","dataFormat", "dataSource"],
        [true, true, true],
        [true, true, true, true],
        true,
      );
      // wait until the transaction is mined
      await createAgreementTx.wait();

      const createAgreementTx2 = await dataSharingAgreement.createAgreement(
        '123',
        'purpose',
        '333',
        '456',
        [1, 356604033949585],
        ["dataType","dataFormat", "dataSource"],
        [true, true, true],
        [true, true, true, true],
        true,
      );
      // wait until the transaction is mined
      await createAgreementTx2.wait();
      const createAgreementTx3 = await dataSharingAgreement.createAgreement(
        '123',
        'purpose',
        '333',
        '789',
        [1, 356604033949585],
        ["dataType","dataFormat", "dataSource"],
        [true, true, true],
        [true, false, false, true],
        true,
      );
      // wait until the transaction is mined
      await createAgreementTx3.wait();
 
      const agreementsLength = await dataSharingAgreement.getAgreementsLength();
      console.log(agreementsLength.toNumber());
      
      agreementsLength.should.equal(3);
    });
  });

  describe('Update DataSharingAgreement', function () {
    it('Should update agreement and emit an event', async function () {
      const updateAgreementTx = await dataSharingAgreement.updateAgreement(
        0,
        '123',
        'sharing data',
        '123',
        '456',
        [1, 356604033949585],
        ["dataType","dataFormat", "dataSource"],
        [true, true, true],
        [true, true, true, false],
        false,
      );
      await updateAgreementTx.wait();
      const agreements = await dataSharingAgreement.getAgreements();
      agreements[0].purpose.should.equal('sharing data');
      expect(agreements[0].licenseGrant.revocable).to.equal(false);
      assert.isFalse(agreements[0].dataStream);
    });
  });

  describe('DataSharingAgreement signed', function () {
    it('Should check if agreement is signed', async function () {
      const signAgreementTx = await dataSharingAgreement.signAgreement(0, "456");
      await signAgreementTx.wait()
      const agreements = await dataSharingAgreement.getAgreements();
      assert.isTrue(agreements[0].signed);
    });
  });


  describe('Check Active Agreements', function () {
    it('Should return Active agreements', async function () {
    
      const checkAgreementActiveAgreementsTx = await dataSharingAgreement.checkActiveAgreements();
      console.log(checkAgreementActiveAgreementsTx);
      
    });
  });


   describe('Check Agreements By Provider', function () {
    it('Should return agreements by provider id', async function () {

      const checkAgreementByProviderTx = await dataSharingAgreement.checkAgreementsByProvider("333");
      console.log(checkAgreementByProviderTx);
      
    });
  });

  describe('Check Agreements By Consumer', function () {
    it('Should return agreements by consumer id', async function () {
  
      const checkAgreementByConsumerTx = await dataSharingAgreement.checkAgreementsByConsumer("789");
      console.log(checkAgreementByConsumerTx);
      
    });
  });

});
