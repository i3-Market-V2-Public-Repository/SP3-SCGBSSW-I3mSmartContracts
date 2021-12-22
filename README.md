# 1. Introduction

Implementation of Data Sharing Agreements (DSA) using Smart Contracts. A DSA contains obligations agreed upon data provider and consumer. 

[Here](https://gitlab.com/i3-market/code/wp3/t3.2/i3m-smartcontracts) is the DSA smart contract project repository.

# 2. Smart Contract Functionality

* <b> Create agreement
  
    Input: Contractual parameters (dataOfferingId, purpose, providerId, consumerId, dates, descriptionOfData, intendedUse, licenseGrant, dataStream)

    Action: Create an agreement with the contractual parameters

    Output: Emit an AgreementCreated event with the provider, cosumer and agreement id.


* <b> Update agreement

    Input: Contractual parameters

    Action: Update an agreement with the contractual parameters

    Output: Emit an AgreementUpdated event with the provider, consumer and agreement id.

* <b> Sign agreement

    Input: AgreementId and ConsumerId

    Action: The consumer with the given consumerId signs the agreement.

    Output: Emit an AgreementSigned event with the agreementId.

* <b> Get agreement 

    Input: AgreementId

    Action: Retrieve the agreement with the given id.

    Output: Agreement

* <b> Get agreement state

    Input: AgreementId
    
    Action: Return the state of the agreement.

    Output: Created/ Active/ Violated/ Terminated

* <b> Get agreements

    Action: Retrieve all agreements

    Output: Array of agreements

* <b> Check active agreements

    Action: Return all active agreements

    Output: Array of Active/signed agreements

* <b> Check agreements by provider 

    Input: ProviderId

    Action: Return the provider’s agreements.

    Output: Array of agreements 

* <b> Check agreements by consumer

    Input: ConsumerId

    Action: Return the consumer’s agreements

    Output: Array of agreements

* <b> Issue claim

    Input: ViolationType, IssuerId, AgreementId

    Action: Set the Violation Type and the issuer of the claim.
    
    Output: Emit a ClaimIssued event with the issuerId.
