const { expect, assert } = require('chai')
const chai = require('chai')
const should = chai.should()

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
      
        
      const agreements = await dataSharingAgreement.getAgreements();
    
      agreementsLength.should.equal(3);
      console.log(agreements[0].state.toString());

      expect(agreements[0].dataOfferingId).to.be.not.undefined;
      expect(agreements[0].dataOfferingId).to.be.not.null;
      expect(agreements[0].dataOfferingId).to.be.not.NaN;

      expect(agreements).to.be.an('array');

      
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
      console.log(agreements[0].state)
    });
  });


  describe('Check Active Agreements', function () {
    it('Should return Active agreements', async function () {
    
      const checkAgreementActiveAgreementsTx = await dataSharingAgreement.checkActiveAgreements();
      expect(checkAgreementActiveAgreementsTx[0].signed).to.be.an('boolean');
      expect(checkAgreementActiveAgreementsTx[0].signed).to.equal(true);
      expect(checkAgreementActiveAgreementsTx[0].state).to.equal(1); 
      expect(checkAgreementActiveAgreementsTx).to.have.lengthOf(1);
      
    });
  });


   describe('Check Agreements By Provider', function () {
    it('Should return agreements by provider id', async function () {

      const checkAgreementByProviderTx = await dataSharingAgreement.checkAgreementsByProvider("333");
      expect(checkAgreementByProviderTx).to.have.lengthOf(2);
      expect(checkAgreementByProviderTx[0].providerId).to.equal('333');
      expect(checkAgreementByProviderTx[1].providerId).to.equal('333');
      
    });
  });

  describe('Check Agreements By Consumer', function () {
    it('Should return agreements by consumer id', async function () {
  
      const checkAgreementByConsumerTx = await dataSharingAgreement.checkAgreementsByConsumer("789");
      expect(checkAgreementByConsumerTx).to.have.lengthOf(1);
      expect(checkAgreementByConsumerTx[0].consumerId).to.equal('789');

      
    });
  });

});
