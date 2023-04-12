# 1. Introduction

Implementation of Data Sharing Agreements (DSA) using Smart Contracts. A DSA contains obligations agreed upon data provider and consumer.

[Here](https://gitlab.com/i3-market/code/wp3/t3.2/i3m-smartcontracts) is the DSA smart contract project repository.

# 2. Smart Contracts Functionality

## Agreement

- <b> Create agreement </b>

  - Input: Contractual parameters (providerPublicKey, consumerPublicKey, dataExchangeAgreementHash, signatures, dataOffering, purpose, dates, intendedUse, licenseGrant, pricingModel, typeOfData)

  - Action: Create an agreement with the contractual parameters

  - Output: Emit an AgreementActive event with the provider and consumer public key and agreement id.

- <b> Get agreement </b>

  - Input: Agreement id

  - Action: Retrieve the agreement with the given id.

  - Output: Agreement

- <b> Get agreement state </b>

  - Input: Agreement id

  - Action: Return the state of the agreement.

  - Output: Active - 0 / Violated - 1 / Terminated - 2

- <b> Retrieve pricing model </b>

  - Input: Agreement id

  - Action: Retrieve pricing model for an agreement

  - Output: Pricing model

- <b> Get agreement by provider </b>

  - Input: Provider public key

  - Action: Return the provider’s agreement.

  - Output: Agreement

- <b> Get agreement by consumer </b>

  - Input: Consumer public key

  - Action: Return the consumer’s agreement

  - Output: Agreement

- <b> Get agreements by data offering id </b>

  - Input: Data offering id

  - Action: Return the agreement ids based on a data offering id

  - Output: Array of agreement ids

- <b> Evaluate signed resolution </b>

  - Input: Agreement id, proof type, type, resolution,
  data exchange id, iat, iss, sub

  - Action: Evaluate signed resolution and return penalties if the resolution is not-completed (verification) or accepted (dispute)

  - Output: Emit PenaltyChoices event with consumer public key, agreement id, penalty choices

- <b> Terminate agreement </b>

  - Input: Agreement id

  - Action: Terminate agreement

  - Output: Emit an AgreementTerminated event with the provider and consumer public key and agreement id.

- <b> Enforce penalty </b>

  - Input: Agreement id, chosen penalty, price, fee, new end date

  - Action: The provider enforces the penalty chosen by the consumer.

  - Output: Emit an AgreeOnPenalty event with provider and consumer public keys, agreement id, chosen penalty, new end date, price, fee

- <b> Notify consent revoked </b>

  - Input: Data offering id

  - Action: Returns an array of consumers who have an agreement for that data offering id

  - Output: Consumer public keys

## Explicit User Consent

- <b> Give consent </b>

  - Input: Data offering id, consent subjects (a list of identifiers of the data owner), consent from hash, start  
           and end date

  - Action: Give consent for a data offering and publish the consent for multiple consent subjects

  - Output: Emit event ConsentGiven with data offering id and consent subjects

- <b> Check consent status </b>

  - Input: Data offering id, consent subjects 

  - Action: Check the status of the consent

  - Output: Consent status
    - Given - end date
    - Revoked - 0

- <b> Revoke consent </b>

  - Input: Data offering id, consent subjects 

  - Action: Revoke consent for the consent subjects

  - Output: Emit event ConsentRevoked with data offering id, consent subjects and consumers (who will be notified   
            that their consent has been revoked)


