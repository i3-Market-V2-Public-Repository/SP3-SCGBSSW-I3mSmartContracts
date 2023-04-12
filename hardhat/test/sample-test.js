const { expect, assert } = require('chai')
const chai = require('chai')
const should = chai.should()

describe('Agreement contract library', function () {
  let DataSharingAgreement
  let dataSharingAgreement
  let ExplicitUserConsent
  let explicitUserConsent
  it('Deploy contract', async function () {
    signers = await ethers.getSigners()

    const AgreementViolationLibrary = await ethers.getContractFactory(
      'AgreementViolationLibrary',
    )
    const agreementViolationLibrary = await AgreementViolationLibrary.deploy()
    await agreementViolationLibrary.deployed()

    DataSharingAgreement = await ethers.getContractFactory(
      'DataSharingAgreement',
      {
        signer: signers[0],
        libraries: {
          AgreementViolationLibrary: agreementViolationLibrary.address,
        },
      },
    )
    dataSharingAgreement = await DataSharingAgreement.deploy()
    await dataSharingAgreement.deployed()

    ExplicitUserConsent = await ethers.getContractFactory('ExplicitUserConsent')
    explicitUserConsent = await ExplicitUserConsent.deploy()
    await explicitUserConsent.deployed()
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
        ['providerSigniture', 'consumerSigniture'],
        ['123', 0, 'title of data offering'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, true],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        true,
      )

      await createAgreementTx.wait()

      const createAgreementTx1 = await dataSharingAgreement.createAgreement(
        '{"kty":"EC","crv":"P-256","x":"4sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture1', 'consumerSigniture1'],
        ['123', 0, 'data offering title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, true],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        true,
      )

      await createAgreementTx1.wait()

      const createAgreementTx2 = await dataSharingAgreement.createAgreement(
        '{"kty":"EC","crv":"P-256","x":"9sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"0MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829w2e8323909',
        ['providerSigniture2', 'consumerSigniture2'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, 138747384783, 356604033949585],
        [true, true, true],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        true,
      )

      await createAgreementTx2.wait()

      const createAgreementTx3 = await dataSharingAgreement.createAgreement(
        'publicKey:provider3',
        'publicKey:consumer3',
        '0x29839829832390sdjiw9',
        ['providerSigniture3', 'consumerSigniture3'],
        ['678', 0, 'title'],
        'purpose',
        [seconds, 13897483784, 356604033949585],
        [true, true, true],
        [
          true,
          false,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        true,
      )

      await createAgreementTx3.wait()

      const createAgreementTx4 = await dataSharingAgreement.createAgreement(
        '{"kty":"EC","crv":"P-256","x":"5sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"3MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture4', 'consumerSigniture4'],
        ['dataOffering2', 0, 'title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, false],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        false,
      )

      await createAgreementTx4.wait()

      const agreement = await dataSharingAgreement.getAgreement(5)

      agreement.agreementId.should.equal(5)

      const agreement3 = await dataSharingAgreement.getAgreement(3)
      expect(agreement3.state).to.equal(0)
  
    })
  })

  describe('Signed Resolution', function () {
    it('Should evaluate Signed Resolution', async function () {
      const evaluateSignedResolutionTx = await dataSharingAgreement.evaluateSignedResolution(
        1,
        'resolution',
        'verification',
        'notCompleted',
        'SNh9yKXb2ehlVHRYBIek-zgZUh2mSSo1jplh7Ia-4yQ',
        13677869,
        '0x7B7C7c0c8952d1BDB7E4D90B1B7b7C48c13355D1',
        '0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903',
      )

      await evaluateSignedResolutionTx.wait()

      const receipt = await ethers.provider.getTransactionReceipt(
        evaluateSignedResolutionTx.hash,
      )
      const interface = new ethers.utils.Interface([
        'event PenaltyChoices(string, uint256, string[3])',
      ])
      const data = receipt.logs[0].data
      const topics = receipt.logs[0].topics
      const event = interface.decodeEventLog('PenaltyChoices', data, topics)
      console.log(event)

      const state = await dataSharingAgreement.getState(1)
      const agreementTx0 = await dataSharingAgreement.getAgreement(1)
      expect(agreementTx0.state).to.equal(1)
      console.log(agreementTx0)

      const evaluateSignedResolutionTx1 = await dataSharingAgreement.evaluateSignedResolution(
        1,
        'resolution',
        'verification',
        'completed',
        'SNh9yKXb2ehlVHRYBIek-zgZUh2mSSo1jplh7Ia-4yQ',
        13677869,
        '0x7B7C7c0c8952d1BDB7E4D90B1B7b7C48c13355D1',
        '0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903',
      )
      await evaluateSignedResolutionTx1.wait()

      const agreementTx1 = await dataSharingAgreement.getAgreement(1)
      expect(agreementTx1.state).to.equal(0)
     

      const evaluateSignedResolutionTx2 = await dataSharingAgreement.evaluateSignedResolution(
        2,
        'resolution',
        'verification',
        'notCompleted',
        'CNh9yKXb2ehlVHRYBIek-zgZUh2mSSo1jplh7Ia-4yQ',
        13677869,
        '0x7B7C7c0c8952d1BDB7E4D90B1B7b7C48c13355D1',
        '0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903',
      )
      await evaluateSignedResolutionTx2.wait()

      const agreementTx = await dataSharingAgreement.getAgreement(2)
      expect(agreementTx.state).to.equal(1)

      const evaluateSignedResolutionTx3 = await dataSharingAgreement.evaluateSignedResolution(
        3,
        'resolution',
        'verification',
        'notCompleted',
        'SNh9yKXb2ehlVHRYBIek-zgZUh2mSSo1jplh7Ia-4yQ',
        13677869,
        '0x7B7C7c0c8952d1BDB7E4D90B1B7b7C48c13355D1',
        '0x17bd12C2134AfC1f6E9302a532eFE30C19B9E903',
      )

      await evaluateSignedResolutionTx3.wait()

      const agreementTx3 = await dataSharingAgreement.getAgreement(3)
      expect(agreementTx3.state).to.equal(1)
    })
  })


  describe('Check Agreements By offering', function () {
    it('Should return agreements by offering id', async function () {
      const checkAgreementByDataOfferingTx = await dataSharingAgreement.checkAgreementsByDataOffering(
        '123',
      )

      expect(checkAgreementByDataOfferingTx).to.have.lengthOf(3)

      const checkAgreementByDataOfferingTxGas = await dataSharingAgreement.estimateGas.checkAgreementsByDataOffering(
        '123',
      )
      console.log(parseInt(checkAgreementByDataOfferingTxGas))

      const checkAgreementByDataOfferingTx2 = await dataSharingAgreement.checkAgreementsByDataOffering(
        'dataOffering2',
      )
      expect(checkAgreementByDataOfferingTx2).to.have.lengthOf(1)
     
      let agreements = []
      for(i=0;i<checkAgreementByDataOfferingTx.length;i++){
        agreements[i] = await dataSharingAgreement.getAgreement(checkAgreementByDataOfferingTx[i]);
      }
      expect(
        agreements[0].dataOffering.dataOfferingId,
      ).to.equal('123')
      expect(
        agreements[1].dataOffering.dataOfferingId,
      ).to.equal('123')
      expect(
        agreements[2].dataOffering.dataOfferingId,
      ).to.equal('123')

    })
  })

  describe('Create more agreements', function () {
    it('Should fail to create agreements', async function () {
      const createAgreementTx5 = await dataSharingAgreement.createAgreement(
        '{"kty":"EC","crv":"P-256","x":"978UIYu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"689MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829w2e8323909',
        ['providerSigniture2', 'consumerSigniture2'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, 56789056789678, 356604033949585],
        [true, true, true],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        true,
      )

      await createAgreementTx5.wait()
    })
  })

  describe('Enforce penalty', function () {
    it('Should enforce resolution', async function () {
    
      const enforcePenaltyTransaction1 = await dataSharingAgreement.enforcePenalty(
        2,
        'NewEndDateForAgreement',
        0,
        0,
        19837823782,
      )

      await enforcePenaltyTransaction1.wait()

      console.log('Event AgreeOnPenalty')
      const receipt = await ethers.provider.getTransactionReceipt(
        enforcePenaltyTransaction1.hash,
      )
      const interface = new ethers.utils.Interface([
        'event AgreeOnPenalty(string, string, uint256, string, uint256, uint256, uint256)',
      ])
      const data = receipt.logs[0].data
      const topics = receipt.logs[0].topics
      const event = interface.decodeEventLog('AgreeOnPenalty', data, topics)
      console.log(event)

      const state1 = await dataSharingAgreement.getState(2)
      expect(state1).to.equal(0)
    })
  })

  describe('Check agreements by consumer after enforcing penalty', function () {
    it('Should return all agreements by consumer public key', async function () {
      
      let consumerKeys = [
        'hhhhiuji',
        'publicKey:consumer',
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"0MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        'cdjfjejf'
      ]
      let agreements = []
      for (let i = 0; i < consumerKeys.length; i++) {
        agreementByConsumerTx = await dataSharingAgreement.getAgreementsByConsumer(
          consumerKeys[i],
          true,
        )
        if(parseInt(agreementByConsumerTx.agreementId)){
          agreements.push(agreementByConsumerTx)
        }
      }
      
  
      expect(agreements).to.have.lengthOf(2)
      expect(agreements[0].consumerPublicKey).to.equal(
        'publicKey:consumer',
      )
      expect(agreements[1].consumerPublicKey).to.equal(
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
      )
      

      agreements2 = []
      consumerKeys2 = [
        'publicKey:consumer',
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"0MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
      ]
      for (let i = 0; i < consumerKeys2.length; i++) {
        agreementByConsumerTx = await dataSharingAgreement.getAgreementsByConsumer(
          consumerKeys2[i],
          false,
        )
        if (parseInt(agreementByConsumerTx.agreementId)>0)
          agreements2.push(agreementByConsumerTx)
      }

      expect(agreements2).to.have.lengthOf(3)
      
      expect(agreements2[0].consumerPublicKey).to.equal(
        'publicKey:consumer',
      )
      expect(agreements2[1].consumerPublicKey).to.equal(
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
      )
    })
  })

  describe('Explicit User Consent', function () {
    it('Give consent', async function () {
      const giveConsentTx = await explicitUserConsent.giveConsent(
        '123',
        ['identifierOfDataOwner1'],
        '93e38ued8j83838r3',
        1782783731,
        1792783732,
      )
      await giveConsentTx.wait()

      const giveConsentTx2 = await explicitUserConsent.giveConsent(
        '123',
        ['identifierOfDataOwner2'],
        '93e38ued8j83838r87',
        1782783732,
        1792783732,
      )
      await giveConsentTx2.wait()

      const giveConsentTx3 = await explicitUserConsent.giveConsent(
        '678',
        ['identifierOfDataOwner3', 'identifierOfDataOwner4'],
        '93e38ued8j83838r3',
        1782783733,
        1792783732,
      )
      await giveConsentTx3.wait()

      const checkConsentStatusTx = await explicitUserConsent.checkConsentStatus(
        '123',
        '',
      )

      const checkConsentStatusTx2 = await explicitUserConsent.checkConsentStatus(
        '123',
        'identifierOfDataOwner2',
      )

      expect(checkConsentStatusTx2[0]).to.equal(1792783732)

      const checkConsentStatusTx4 = await explicitUserConsent.checkConsentStatus(
        '678',
        'identifierOfDataOwner4',
      )
    
      expect(checkConsentStatusTx4[0]).to.equal(1792783732)

      const revokeConsentTx1 = await explicitUserConsent.revokeConsent(
        dataSharingAgreement.address,
        '123',
        ['identifierOfDataOwner1'],
      )
      await revokeConsentTx1.wait()

      const receipt1 = await ethers.provider.getTransactionReceipt(
        revokeConsentTx1.hash,
      )
      const interface1 = new ethers.utils.Interface([
        'event ConsentRevoked(string[], string, string[])',
      ])
      const data1 = receipt1.logs[0].data
      const topics1 = receipt1.logs[0].topics
      const event1 = interface1.decodeEventLog('ConsentRevoked', data1, topics1)
      console.log(event1)

      const checkConsentStatusTx11 = await explicitUserConsent.checkConsentStatus(
        '123',
        'identifierOfDataOwner1',
      )

      expect(checkConsentStatusTx11[0]).to.equal(0)

      const revokeConsentTx2 = await explicitUserConsent.revokeConsent(
        dataSharingAgreement.address,
        '678',
        ['identifierOfDataOwner3'],
      )
      await revokeConsentTx2.wait()
      const receipt2 = await ethers.provider.getTransactionReceipt(
        revokeConsentTx2.hash,
      )
      const interface2 = new ethers.utils.Interface([
        'event ConsentRevoked(string[], string, string[])',
      ])
      const data2 = receipt2.logs[0].data
      const topics2 = receipt2.logs[0].topics
      const event2 = interface2.decodeEventLog('ConsentRevoked', data2, topics2)
      console.log('different data offering')
      console.log(event2)

      const revokeConsentTx = await explicitUserConsent.revokeConsent(
        dataSharingAgreement.address,
        '123',
        [],
      )
      await revokeConsentTx.wait()
      const receipt = await ethers.provider.getTransactionReceipt(
        revokeConsentTx.hash,
      )
      const interface = new ethers.utils.Interface([
        'event ConsentRevoked(string[], string, string[])',
      ])
      const data = receipt.logs[0].data
      const topics = receipt.logs[0].topics
      const event = interface.decodeEventLog('ConsentRevoked', data, topics)
      console.log(event)

      const checkConsentStatusTx22 = await explicitUserConsent.checkConsentStatus(
        '123',
        '',
      )
      console.log(checkConsentStatusTx22)

      expect(checkConsentStatusTx22[0]).to.equal(0)
      expect(checkConsentStatusTx22[1]).to.equal(0)

      const checkConsentStatusTx3 = await explicitUserConsent.checkConsentStatus(
        '123',
        'identifierOfDataOwner1',
      )
      expect(checkConsentStatusTx3[0]).to.equal(0)
      const giveConsentTx33 = await explicitUserConsent.giveConsent(
        '123',
        ['identifierOfDataOwner1'],
        '93e38ued8j83838r3',
        1782783731,
        1792783732,
      )
      await giveConsentTx33.wait()

      const checkConsentStatusTx33 = await explicitUserConsent.checkConsentStatus(
        '123',
        'identifierOfDataOwner1',
      )
      expect(checkConsentStatusTx33[0]).to.equal(1792783732)
    })
  })

  describe('Terminate agreement', function () {
    it('Should terminate', async function () {
      const agreement = await dataSharingAgreement.getAgreement(4)

      if (agreement.typeOfData.dataStream) {
        const date = new Date()
        const now = Math.floor(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
          ).getTime() / 1000,
        )
        if (parseInt(agreement.agreementDates[2]) < now) {
          console.log('End date ok terminate')
        } else {
          console.log('End date of the agreement is not reached.')
        }
      } else {
        console.log('Batch data')
        const terminateTransaction = await dataSharingAgreement.terminateAgreement(
          4,
          true,
        )

        await terminateTransaction.wait()
        console.log('Event AgreementTerminated')
        const receiptTerminate = await ethers.provider.getTransactionReceipt(
          terminateTransaction.hash,
        )
        const interface2 = new ethers.utils.Interface([
          'event AgreementTerminated(string, string, uint256)',
        ])
        const dataTermination = receiptTerminate.logs[0].data
        const topicsTermination = receiptTerminate.logs[0].topics
        const eventTerminate = interface2.decodeEventLog(
          'AgreementTerminated',
          dataTermination,
          topicsTermination,
        )
        console.log(eventTerminate)

        const state2 = await dataSharingAgreement.getState(4)
        expect(state2).to.equal(2)
      }
    })
  })

  describe('Get Agreements By Consumers', function () {
    it('Should return all agreements by consumer public keys', async function () {
     
      let consumerKeys = [
        'publicKey:consumer',
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"0MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        'publicKey:consumer3',
      ]
      let agreements = []
      for (let i = 0; i < consumerKeys.length; i++) {
        agreementByConsumerTx = await dataSharingAgreement.getAgreementsByConsumer(
          consumerKeys[i],
          true,
        )
        if(parseInt(agreementByConsumerTx.agreementId))
          agreements.push(agreementByConsumerTx)
      }
      
  
      expect(agreements).to.have.lengthOf(2)
      expect(agreements[0].consumerPublicKey).to.equal(
        'publicKey:consumer',
      )
      expect(agreements[1].consumerPublicKey).to.equal(
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
      )
      

      let consumerKeys2 = [
        'publicKey:consumer',
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '{"kty":"EC","crv":"P-256","x":"0MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        'publicKey:consumer3',
      ]
      let agreements2 = []
      for (let i = 0; i < consumerKeys2.length; i++) {
        agreementByConsumerTx = await dataSharingAgreement.getAgreementsByConsumer(
          consumerKeys2[i],
          false,
        )
        if(parseInt(agreementByConsumerTx.agreementId))
          agreements2.push(agreementByConsumerTx)
      }
      
      expect(agreements2).to.have.lengthOf(4)
    })
  })
  describe('Get Agreements By Provider', function () {
    it('Should return all agreements by provider public keys', async function () {
      let providerKeys = ['publicKey:provider', 'publicKey:provider3']
      let agreements = []
      for (let i = 0; i < providerKeys.length; i++) {
        agreementByProviderTx = await dataSharingAgreement.getAgreementsByProvider(
          providerKeys[i],
          false,
        )
        agreements.push(agreementByProviderTx)
      }
      expect(agreements).to.have.lengthOf(2)

      agreements2 = []
      providerKeys2 = [
        '{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        'publicKey:provider3',
        'publicKey:provider',
        'wejdijf',
        'deifjiji',
        'eifjierf',
      ]
      for (let i = 0; i < providerKeys2.length; i++) {
        agreementByProviderTx = await dataSharingAgreement.getAgreementsByProvider(
          providerKeys2[i],
          true,
        )
        if (parseInt(agreementByProviderTx.agreementId))
          agreements2.push(agreementByProviderTx)
      }

      expect(agreements2).to.have.lengthOf(1)
    })
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
        '1publicKey:provider',
        '1publicKey:consumer',
        '0x298398298323909',
        ['providerSigniture', 'consumerSigniture'],
        ['123', 0, 'title of data offering'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, true],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        true,
      )

      await createAgreementTx.wait()

      const createAgreementTx1 = await dataSharingAgreement.createAgreement(
        '1{"kty":"EC","crv":"P-256","x":"4sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '1{"kty":"EC","crv":"P-256","x":"6MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture1', 'consumerSigniture1'],
        ['123', 0, 'data offering title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, true],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        true,
      )

      await createAgreementTx1.wait()

      const createAgreementTx2 = await dataSharingAgreement.createAgreement(
        '1{"kty":"EC","crv":"P-256","x":"9sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '1{"kty":"EC","crv":"P-256","x":"0MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829w2e8323909',
        ['providerSigniture2', 'consumerSigniture2'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, 138747384783, 356604033949585],
        [true, true, true],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        true,
      )

      await createAgreementTx2.wait()

      const createAgreementTx3 = await dataSharingAgreement.createAgreement(
        '1publicKey:provider3',
        '1publicKey:consumer3',
        '0x29839829832390sdjiw9',
        ['providerSigniture3', 'consumerSigniture3'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, 13897483784, 356604033949585],
        [true, true, true],
        [
          true,
          false,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        true,
      )

      await createAgreementTx3.wait()

      const createAgreementTx4 = await dataSharingAgreement.createAgreement(
        '1{"kty":"EC","crv":"P-256","x":"5sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '1{"kty":"EC","crv":"P-256","x":"3MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture4', 'consumerSigniture4'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, false],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        false,
      )

      await createAgreementTx4.wait()

      const createAgreementTx5 = await dataSharingAgreement.createAgreement(
        '12{"kty":"EC","crv":"P-256","x":"5sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '12{"kty":"EC","crv":"P-256","x":"3MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture4', 'consumerSigniture4'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, false],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        false,
      )

      await createAgreementTx5.wait()

      const createAgreementTx6 = await dataSharingAgreement.createAgreement(
        '22{"kty":"EC","crv":"P-256","x":"5sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '22{"kty":"EC","crv":"P-256","x":"3MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture4', 'consumerSigniture4'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, false],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        false,
      )

      await createAgreementTx6.wait()

      const createAgreementTx7 = await dataSharingAgreement.createAgreement(
        '3{"kty":"EC","crv":"P-256","x":"5sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '3{"kty":"EC","crv":"P-256","x":"3MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture4', 'consumerSigniture4'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, false],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        false,
      )

      await createAgreementTx7.wait()

      const createAgreementTx8 = await dataSharingAgreement.createAgreement(
        '4{"kty":"EC","crv":"P-256","x":"5sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '4{"kty":"EC","crv":"P-256","x":"3MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture4', 'consumerSigniture4'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, false],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        false,
      )

      await createAgreementTx8.wait()

      const createAgreementTx9 = await dataSharingAgreement.createAgreement(
        '5{"kty":"EC","crv":"P-256","x":"5sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '5{"kty":"EC","crv":"P-256","x":"3MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture4', 'consumerSigniture4'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, false],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        false,
      )

      await createAgreementTx9.wait()

      const createAgreementTx10 = await dataSharingAgreement.createAgreement(
        '6{"kty":"EC","crv":"P-256","x":"5sxPPpsZomxPmPwDAsqSp94QpZ3iXP8xX4VxWCSCfms","y":"8YI_bvVrKPW63bGAsHgRvwXE6uj3TlnHwoQi9XaEBBE","alg":"ES256"}',
        '6{"kty":"EC","crv":"P-256","x":"3MGDu3EsCdEJZVV2KFhnF2lxCRI5yNpf4vWQrCIMk5M","y":"0OZbKAdooCqrQcPB3Bfqy0g-Y5SmnTyovFoFY35F00M","alg":"ES256"}',
        '0x29839829832390923',
        ['providerSigniture4', 'consumerSigniture4'],
        ['123', 0, 'title'],
        'purpose',
        [seconds, seconds, 356604033949585],
        [true, true, false],
        [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          false,
          false,
          false,
          false,
        ],
        ['one-time purchase', 788, '$', 76, ['jij', 'jkhh'], false],
        false,
      )

      await createAgreementTx10.wait()

      const agreement = await dataSharingAgreement.getAgreement(17)

      agreement.agreementId.should.equal(17)

    })
  })
})
