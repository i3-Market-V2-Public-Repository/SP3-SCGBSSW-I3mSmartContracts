/*
* Copyright (c) Siemens AG, 2020-2022
*
* Authors:
*  Susanne Stahnke <susanne.stahnke@siemens.com>,
*  Yvonne Kovacs <yvonne.kovacs@siemens.com> 
*
* This work is licensed under the terms of Apache 2.0.  See
* the LICENSE file in the top-level directory.
*/

const { expect, assert } = require('chai')
const chai = require('chai')
const should = chai.should()
      
    describe('Agreement contract library', function () {
      let DataSharingAgreement
      let dataSharingAgreement
      let ExplicitUserConsent
      let explicitUserConsent
      it('Deploy contract', async function () {
        signers = await ethers.getSigners();
        const Lib = await ethers.getContractFactory("AgreementLib");
        const lib = await Lib.deploy();
        await lib.deployed();

        const AgreementViolationLibrary = await ethers.getContractFactory("AgreementViolationLibrary");
        const agreementViolationLibrary = await AgreementViolationLibrary.deploy();
        await agreementViolationLibrary.deployed();

        const RetrieveAgreementsLibrary = await ethers.getContractFactory("RetrieveAgreementsLibrary");
        const retrieveAgreementsLibrary = await RetrieveAgreementsLibrary.deploy();
        await retrieveAgreementsLibrary.deployed();

        
        const GetAgreementsLibrary = await ethers.getContractFactory("GetAgreementsLibrary");
        const getAgreementsLibrary = await GetAgreementsLibrary.deploy();
        await getAgreementsLibrary.deployed();

        DataSharingAgreement = await ethers.getContractFactory(
          'DataSharingAgreement', {
            signer: signers[0],
            libraries: {
              AgreementLib: lib.address,
              AgreementViolationLibrary: agreementViolationLibrary.address,
              RetrieveAgreementsLibrary: retrieveAgreementsLibrary.address,
              GetAgreementsLibrary: getAgreementsLibrary.address,
            },
        })
        dataSharingAgreement = await DataSharingAgreement.deploy()
        await dataSharingAgreement.deployed()

        ExplicitUserConsent = await ethers.getContractFactory("ExplicitUserConsent");
        explicitUserConsent = await ExplicitUserConsent.deploy();
        await explicitUserConsent.deployed();

      })
  
  describe('Create DataSharingAgreement', function () {
    it('Should create agreement and emit an event', async function () {
      const today = new Date()

      const today2 = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      )
      
      const mseconds = today2.getTime()
     
      seconds = Math.floor(mseconds / 1000)

      const dateInSecs = Math.floor(new Date().getTime() / 1000)
      const createAgreementTx = await dataSharingAgreement.createAgreement(
        'publicKey:provider',
        'publicKey:consumer',
        '0x298398298323909',
        ["providerSigniture", "consumerSigniture"],
        ['123', 0, 'title of data offering'], 
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, true],
        [true, true, true, true, true, true, true, true, true, true, true, true,true, true, true, true],
        ["one-time purchase",788,"$",76,["jij","jkhh"],false],
        true,
      )

      await createAgreementTx.wait()

      const createAgreementTx1 = await dataSharingAgreement.createAgreement(
        '{"kty":"EC","crv":"P-256","x":"4sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ["providerSigniture1", "consumerSigniture1"],
        ['123', 0, 'data offering title'], 
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, true],
        [true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false],
        ["one-time purchase",788,"$",76,["jij","jkhh"],false],
        true,
      )

      await createAgreementTx1.wait()

      const createAgreementTx2 = await dataSharingAgreement.createAgreement(
        '{"kty":"EC","crv":"P-256","x":"9sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"0MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829w2e8323909',
        ["providerSigniture2", "consumerSigniture2"],
        ['123', 0, 'title'], 
        'purpose',
        [seconds, 138747384783, 356604033949585],
        [true, true, true],
        [true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false],
        ["one-time purchase",788,"$",76,["jij","jkhh"],false],
        true,
      )

      await createAgreementTx2.wait()

      const createAgreementTx3 = await dataSharingAgreement.createAgreement(
        'publicKey:provider3',
        'publicKey:consumer3',
        '0x29839829832390sdjiw9',
        ["providerSigniture3", "consumerSigniture3"],
        ['678', 0, 'title'], 
        'purpose',
        [seconds, 13897483784, 356604033949585],
        [true, true, true],
        [true, false, false, true,true, true, true, true, true, true, true, true, false, false, false, false],
        ["one-time purchase",788,"$",76,["jij","jkhh"],false],
        true,
      )

      await createAgreementTx3.wait()

      const createAgreementTx4 = await dataSharingAgreement.createAgreement(
        '{"kty":"EC","crv":"P-256","x":"5sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"3MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ["providerSigniture4", "consumerSigniture4"],
        ['dataOffering2', 0, 'title'], 
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, false],
        [true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false],
        ["one-time purchase",788,"$",76,["jij","jkhh"],false],
        false,
      )

      await createAgreementTx4.wait()

      const agreementsLength = await dataSharingAgreement.getAgreementsLength()

      agreementsLength.should.equal(5)

      const agreement0 =await dataSharingAgreement.getAgreement(0)

      expect(agreement0.dataOffering.dataOfferingId).to.be.not.undefined
      expect(agreement0.dataOffering.dataOfferingId).to.be.not.null
      expect(agreement0.dataOffering.dataOfferingId).to.be.not.NaN

    })
  })

  describe('Signed Resolution', function () {
    it('Should evaluate Signed Resolution', async function () {
      const evaluateSignedResolutionTx = await dataSharingAgreement.evaluateSignedResolution(
        0,
        'resolution',
        'verification',
        'notCompleted',
        'SNh9yKXb2ehlVHRYBIek-zgZUh2mSSo1jplh7Ia-4yQ',
        13677869,
        '0x7B7C7c0c8952d1BDB7E4D90B1B7b7C48c13355D1',
        '0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903',
      )

      await evaluateSignedResolutionTx.wait()

      const receipt = await ethers.provider.getTransactionReceipt(evaluateSignedResolutionTx.hash);
      const interface = new ethers.utils.Interface(["event PenaltyChoices(string, uint256, string[3])"]);
      const data = receipt.logs[0].data;
      const topics = receipt.logs[0].topics;
      const event = interface.decodeEventLog("PenaltyChoices", data, topics);
      console.log(event)

   
      const state= await dataSharingAgreement.getState(0)
      const agreementTx0 = await dataSharingAgreement.getAgreement(0)
      expect(agreementTx0.state).to.equal(1)
   

      const evaluateSignedResolutionTx1 = await dataSharingAgreement.evaluateSignedResolution(
        0,
        'resolution',
        'verification',
        'completed',
        'SNh9yKXb2ehlVHRYBIek-zgZUh2mSSo1jplh7Ia-4yQ',
        13677869,
        '0x7B7C7c0c8952d1BDB7E4D90B1B7b7C48c13355D1',
        '0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903',
      )
      await evaluateSignedResolutionTx1.wait()

      const state1= await dataSharingAgreement.getState(0)
      console.log(state1)
   
      const evaluateSignedResolutionTx2 = await dataSharingAgreement.evaluateSignedResolution(
        1,
        'resolution',
        'verification',
        'notCompleted',
        'CNh9yKXb2ehlVHRYBIek-zgZUh2mSSo1jplh7Ia-4yQ',
        13677869,
        '0x7B7C7c0c8952d1BDB7E4D90B1B7b7C48c13355D1',
        '0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903',
      )
      await evaluateSignedResolutionTx2.wait()

      
      const agreementTx = await dataSharingAgreement.getAgreement(1)
      expect(agreementTx.state).to.equal(1)
     
      
    })
  })


  describe('Check Active Agreements', function () {
    it('Should return Active agreements', async function () {
      const checkAgreementActiveAgreementsTx = await dataSharingAgreement.checkActiveAgreements()
      expect(checkAgreementActiveAgreementsTx[0].state).to.equal(0)
      expect(checkAgreementActiveAgreementsTx).to.have.lengthOf(3)
    })
  })

  describe('Check Agreements By offering', function () {
    it('Should return agreements by offering id', async function () {
      const checkAgreementByDataOfferingTx = await dataSharingAgreement.checkAgreementsByDataOffering(
        '123',
      )
      expect(checkAgreementByDataOfferingTx).to.have.lengthOf(3)
      expect(checkAgreementByDataOfferingTx[0].dataOffering.dataOfferingId).to.equal('123')
   
    })
  })

  describe('Create more agreements', function () {
    it('Should fail to create agreements', async function () {

      const createAgreementTx5 = await dataSharingAgreement.createAgreement(
        '{"kty":"EC","crv":"P-256","x":"978UIYu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"689MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829w2e8323909',
        ["providerSigniture2", "consumerSigniture2"],
        ['123', 0, 'title'], 
        'purpose',
        [seconds, 56789056789678, 356604033949585],
        [true, true, true],
        [true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false],
        ["one-time purchase",788,"$",76,["jij","jkhh"],false],
        true,
      )

      await createAgreementTx5.wait()

      const createAgreementTx6 = await dataSharingAgreement.createAgreement(
        '{"kty":"EC","crv":"P-256","x":"6IOPu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829w2e8323909',
        ["providerSigniture2", "consumerSigniture2"],
        ['123', 0, 'title'], 
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, true],
        [true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false],
        ["one-time purchase",788,"$",76,["jij","jkhh"],false],
        true,
      )

      await createAgreementTx6.wait()
    })
  })


  describe('Enforce penalty', function () {
    it('Should enforce resolution', async function () {
      //transaction reverted because agreement is not violated
      // const enforcePenaltyTransaction = await dataSharingAgreement.enforcePenalty(
      //   0,
      //   "Terminate",
      //   0,
      //   0,
      //   0
     
      // )

      // await enforcePenaltyTransaction.wait()

      // const state= await dataSharingAgreement.getState(0)
      // console.log(state)

      const enforcePenaltyTransaction1 = await dataSharingAgreement.enforcePenalty(
        1,
        "NewEndDateForAgreement",
        0,
        0,
        19837823782
     
      )

      await enforcePenaltyTransaction1.wait()

      console.log("Event AgreeOnPenalty")
      const receipt = await ethers.provider.getTransactionReceipt(enforcePenaltyTransaction1.hash);
      const interface = new ethers.utils.Interface(["event AgreeOnPenalty(string, string, uint256, string, uint256, uint256, uint256)"]);
      const data = receipt.logs[0].data;
      const topics = receipt.logs[0].topics;
      const event = interface.decodeEventLog("AgreeOnPenalty", data, topics);
      console.log(event)

      const state1= await dataSharingAgreement.getState(1)
      expect(state1).to.equal(0)
    })
  })

  describe('Retrieve agreement for data access', function () {
    it('Should retrieve Active and start date reached agreements', async function () {

      const getAgreementStartDateNotReachedTx = await dataSharingAgreement.retrieveAgreements(
        'publicKey:consumer',
      )
      expect(getAgreementStartDateNotReachedTx[1]).to.equal(0)
      const getAgreementsTx1 = await dataSharingAgreement.retrieveAgreements(
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
      )
   
      expect(parseInt(getAgreementsTx1[1])).to.equal(1)
      const activeAgreements = getAgreementsTx1[0]
      
      const length = parseInt(getAgreementsTx1[1])

      const getAgreementsTx2 = await dataSharingAgreement.retrieveAgreements(
        'publicKey:consumer287',
      )
      expect(getAgreementsTx2[0]).to.have.lengthOf(0)

      })
    })

    

  describe('Check agreements by consumer after enforcing penalty', function () {
    it('Should return all agreements by consumer public key', async function () {
      const checkAgreementByConsumerTx = await dataSharingAgreement.getAgreementsByConsumer(
        [ 'publicKey:consumer',
          '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}'],
        true
      )
      expect(checkAgreementByConsumerTx).to.have.lengthOf(1)
     
      const checkAllAgreementsByConsumerTx = await dataSharingAgreement.getAgreementsByConsumer(
        [  'publicKey:consumer',
          '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}'], 
        
        false
      )
      expect(checkAllAgreementsByConsumerTx).to.have.lengthOf(2)
      expect(checkAllAgreementsByConsumerTx[0].consumerPublicKey).to.equal('publicKey:consumer')
      expect(checkAllAgreementsByConsumerTx[1].consumerPublicKey).to.equal('{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}')
    })
  })



describe('Explicit User Consent', function () {
  it('Give consent', async function () {
    const giveConsentTx = await explicitUserConsent.giveConsent(
     "123",
     ["identifierOfDataOwner1"],
     "93e38ued8j83838r3",
     1782783731,
     1792783732,
    )
    await giveConsentTx.wait()

    const giveConsentTx2 = await explicitUserConsent.giveConsent(
      "123",
      ["identifierOfDataOwner2"],
      "93e38ued8j83838r87",
      1782783732,
      1792783732,
     )
     await giveConsentTx2.wait()

    const giveConsentTx3 = await explicitUserConsent.giveConsent(
      "678",
      ["identifierOfDataOwner3", "identifierOfDataOwner4"],
      "93e38ued8j83838r3",
      1782783733,
      1792783732,
     )
    await giveConsentTx3.wait()

    const checkConsentStatusTx = await explicitUserConsent.checkConsentStatus(
      "123",
      ""
    )

    console.log (checkConsentStatusTx)

    const checkConsentStatusTx2 = await explicitUserConsent.checkConsentStatus(
      "123", 
      "identifierOfDataOwner2"
    )
    console.log(parseInt(checkConsentStatusTx2))
    expect(checkConsentStatusTx2[0]).to.equal(1792783732)
    

    const checkConsentStatusTx4 = await explicitUserConsent.checkConsentStatus(
      "678", 
      "identifierOfDataOwner4"
    )
    console.log(parseInt(checkConsentStatusTx4))
    expect(checkConsentStatusTx4[0]).to.equal(1792783732)
    
   
    console.log(checkConsentStatusTx)
    console.log(checkConsentStatusTx2)

    const revokeConsentTx1 = await explicitUserConsent.revokeConsent(
      dataSharingAgreement.address,
      "123",
      ["identifierOfDataOwner1"]
     )
     await revokeConsentTx1.wait()
     const receipt1 = await ethers.provider.getTransactionReceipt(revokeConsentTx1.hash);
     const interface1 = new ethers.utils.Interface(["event ConsentRevoked(string[], string, string[])"]);
     const data1 = receipt1.logs[0].data;
     const topics1 = receipt1.logs[0].topics;
     const event1 = interface1.decodeEventLog("ConsentRevoked", data1, topics1);
     console.log(event1)

     
    const checkConsentStatusTx11 = await explicitUserConsent.checkConsentStatus(
      "123",
      "identifierOfDataOwner1"
    )
      
    expect(checkConsentStatusTx11[0]).to.equal(0)
    

    const revokeConsentTx2 = await explicitUserConsent.revokeConsent(
      dataSharingAgreement.address,
      "678",
      ["identifierOfDataOwner3"]
     )
     await revokeConsentTx2.wait()
     const receipt2 = await ethers.provider.getTransactionReceipt(revokeConsentTx2.hash);
     const interface2 = new ethers.utils.Interface(["event ConsentRevoked(string[], string, string[])"]);
     const data2 = receipt2.logs[0].data;
     const topics2 = receipt2.logs[0].topics;
     const event2 = interface2.decodeEventLog("ConsentRevoked", data2, topics2);
     console.log("different data offering")
     console.log(event2)

     


    const revokeConsentTx = await explicitUserConsent.revokeConsent(
      dataSharingAgreement.address,
      "123",
      []
     )
     await revokeConsentTx.wait()
     const receipt = await ethers.provider.getTransactionReceipt(revokeConsentTx.hash);
     const interface = new ethers.utils.Interface(["event ConsentRevoked(string[], string, string[])"]);
     const data = receipt.logs[0].data;
     const topics = receipt.logs[0].topics;
     const event = interface.decodeEventLog("ConsentRevoked", data, topics);
     console.log(event)

     
     const checkConsentStatusTx22 = await explicitUserConsent.checkConsentStatus(
      "123",
      ""
    )
    console.log(checkConsentStatusTx22)
  
    expect(checkConsentStatusTx22[0]).to.equal(0)
    expect(checkConsentStatusTx22[1]).to.equal(0)

  
    const checkConsentStatusTx3 = await explicitUserConsent.checkConsentStatus(
      "123",
      "identifierOfDataOwner1"
    )
    expect(checkConsentStatusTx3[0]).to.equal(0)
    const giveConsentTx33 = await explicitUserConsent.giveConsent(
      "123",
      ["identifierOfDataOwner1"],
      "93e38ued8j83838r3",
      1782783731,
      1792783732,
     )
     await giveConsentTx33.wait()

     const checkConsentStatusTx33 = await explicitUserConsent.checkConsentStatus(
      "123", 
      "identifierOfDataOwner1"
    )
    expect(checkConsentStatusTx33[0]).to.equal(1792783732)

  })

})

describe('Terminate agreement', function () {
  it('Should terminate', async function () {
    
    const agreement = await dataSharingAgreement.getAgreement(3)
   
    if(agreement.typeOfData.dataStream)
    {
        const date = new Date()
        const now = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate(),).getTime() / 1000)
        if(parseInt(agreement.agreementDates[2])<now)
        {
            console.log("End date ok terminate")
        }
        else {
            console.log("End date of the agreement is not reached.")
        }
    }
    else{
      console.log("Batch data")
      const terminateTransaction = await dataSharingAgreement.terminateAgreement(
        3,
        true
      )
  
      await terminateTransaction.wait()
      console.log("Event AgreementTerminated")
      const receiptTerminate = await ethers.provider.getTransactionReceipt(terminateTransaction.hash);
      const interface2 = new ethers.utils.Interface(["event AgreementTerminated(string, string, uint256)"]);
      const dataTermination = receiptTerminate.logs[0].data;
      const topicsTermination = receiptTerminate.logs[0].topics;
      const eventTerminate = interface2.decodeEventLog("AgreementTerminated", dataTermination, topicsTermination);
      console.log(eventTerminate)
  
      const state2= await dataSharingAgreement.getState(3)
      expect(state2).to.equal(2)
    }
    
    
      
  })
})

describe('Get Agreements By Consumers', function () {
  it('Should return all agreements by consumer public keys', async function () {
    const getAgreementByConsumerTx = await dataSharingAgreement.getAgreementsByConsumer(
      [
        'publicKey:consumer',
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"0MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        'publicKey:consumer3',
       ],
       true
    )
   expect(getAgreementByConsumerTx).to.have.lengthOf(2)

   const getAgreementByConsumerTx2 = await dataSharingAgreement.getAgreementsByConsumer(
    [
      'publicKey:consumer',
      '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
      '{"kty":"EC","crv":"P-256","x":"0MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
      'publicKey:consumer3',
    ],
     false
  )
 expect(getAgreementByConsumerTx2).to.have.lengthOf(4)
   
    
  })
})
describe('Get Agreements By Provider', function () {
  it('Should return all agreements by provider public keys', async function () {
    const getAgreementByProviderTx = await dataSharingAgreement.getAgreementsByProvider(
      [
        'publicKey:provider',
        'publicKey:provider3'
      ],
       false
    )

   expect(getAgreementByProviderTx).to.have.lengthOf(2)

   const getAgreementByProviderTx2 = await dataSharingAgreement.getAgreementsByProvider(
    [
      'publicKey:provider',
      'publicKey:provider3'
    ],
     true
  )
  expect(getAgreementByProviderTx2).to.have.lengthOf(0)
   
    
  })
})


describe('Get Agreements By Consumers', function () {
  it('Should return all agreements by consumer public keys', async function () {
    const getAgreementByConsumerTx = await dataSharingAgreement.getAgreementsByConsumer(
      [
        'publicKey:consumer',
        'publicKey:consumir3',
       ],
       true
    )
   expect(getAgreementByConsumerTx).to.have.lengthOf(0)

    
  })
})



})

    
