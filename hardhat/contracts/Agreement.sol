// /*

// * Copyright (c) Siemens AG, 2020-2022

// *

// * Authors:

// * Susanne Stahnke <susanne.stahnke@siemens.com>,

// * Yvonne Kovacs <yvonne.kovacs@siemens.com>

// *

// * This work is licensed under the terms of Apache 2.0. See

// * the LICENSE file in the top-level directory.

// */

pragma solidity ^0.8.0;

enum State {
    Active,
    Violated,
    Terminated
}

struct Agreement {
    uint256 agreementId;
    string providerPublicKey;
    string consumerPublicKey;
    string dataExchangeAgreementHash;
    string[2] signatures;
    DataOffering dataOffering;
    string purpose;
    State state;
    uint256[3] agreementDates;
    IntendedUse intendedUse;
    LicenseGrant licenseGrant;
    TypeOfData typeOfData;
    PricingModel pricingModel;
    Violation violation;
}

struct TypeOfData {
    bool dataStream;
    bool personalData;
}

struct DataOffering {
    string dataOfferingId;
    uint256 dataOfferingVersion;
    string title;
}

struct IntendedUse {
    bool processData;
    bool shareDataWithThirdParty;
    bool editData;
}

struct LicenseGrant {
    bool transferable;
    bool exclusiveness;
    bool paidUp;
    bool revocable;
    bool processing;
    bool modifying;
    bool analyzing;
    bool storingData;
    bool storingCopy;
    bool reproducing;
    bool distributing;
    bool loaning;
    bool selling;
    bool renting;
    bool furtherLicensing;
    bool leasing;
}

struct PricingModel {
    string paymentType;
    uint256 price;
    string currency;
    uint256 fee;
    PaymentOnSubscription paymentOnSubscription;
    bool isFree;
}

struct PaymentOnSubscription {
    string timeDuration;
    string repeat;
}

enum ViolationType {
    NotViolated,
    PaymentNotCompleted,
    DataNotTransferredAsDescribed,
    DataNotAsDescribed,
    LicenseViolated
}

struct Violation {
    ViolationType violationType;
    string issuerId;
    string[3] penaltyChoices;
}

struct Counter {
    uint256 activeAgreementCount;
    mapping (string => uint) providerCount;
    mapping (string => uint) providerActiveCount;
    mapping (string => uint) consumerCount;
    mapping (string => uint) consumerActiveCount;
    mapping (string => uint) dataOfferingCount;
}

struct SignedResolution {
    string proofType;
    string resolutionType;
    string resolution;
    string dataExchangeId;
    uint256 iat;
    string iss;
    string sub;
}

library AgreementViolationLibrary {

    function evaluateResolution(
        Agreement storage agreement,
        string memory _proofType,
        string memory _type,
        string memory _resolution,
        string memory _dataExchangeId,
        uint256 _iat,
        string memory _iss,
        string memory _sub,
        Counter storage counter) public {

        SignedResolution memory signedResolution;
        signedResolution.proofType = _proofType;
        signedResolution.resolutionType = _type;
        signedResolution.resolution = _resolution;
        signedResolution.dataExchangeId = _dataExchangeId;
        signedResolution.iat = _iat;
        signedResolution.iss = _iss;   
        signedResolution.sub = _sub;

        if(keccak256(abi.encodePacked(signedResolution.resolution)) == keccak256(abi.encodePacked("completed"))){
            delete agreement.violation.penaltyChoices;   
        }
        else if(keccak256(abi.encodePacked(signedResolution.resolution)) == keccak256(abi.encodePacked("notCompleted"))) { 
                issueViolation(agreement, ViolationType.DataNotTransferredAsDescribed, signedResolution.sub); 
                agreement.state = State.Violated; 
                counter.activeAgreementCount--;
                counter.providerActiveCount[agreement.providerPublicKey]--;
                counter.consumerActiveCount[agreement.consumerPublicKey]--;
                
        }
        else if(keccak256(abi.encodePacked(signedResolution.resolution)) == keccak256(abi.encodePacked("accepted"))){ 
                issueViolation(agreement, ViolationType.DataNotTransferredAsDescribed, signedResolution.sub); 
                agreement.state = State.Violated; 
                counter.activeAgreementCount--;
                counter.providerActiveCount[agreement.providerPublicKey]--;
                counter.consumerActiveCount[agreement.consumerPublicKey]--;
             }
        else if(keccak256(abi.encodePacked(signedResolution.resolution)) == keccak256(abi.encodePacked("denied"))){
                delete agreement.violation.penaltyChoices;  
        }

    }

    function issueViolation(Agreement storage agreement, ViolationType _violationType, string memory _issuerId) private {
        agreement.violation = Violation(_violationType, _issuerId, ["Terminate", "NewEndDateForAgreement", "NewEndDateForAgreementAndReductionOfPayment"]);
    }

     function getViolation(Agreement storage agreement) public view returns (Violation memory){
        return agreement.violation;
    }
   
    function enforcePenalty (Agreement storage agreement, string memory _chosenPenalty, uint256 _price, uint256 _fee,
                             uint256 _newEndDate, Counter storage counter) public {

        if(agreement.violation.violationType == ViolationType.DataNotTransferredAsDescribed){
                if (keccak256(abi.encodePacked(_chosenPenalty)) == "NewEndDateForAgreement"){
                    require(_newEndDate > block.timestamp, "New end date must be after current date");
                    agreement.agreementDates[2] = _newEndDate;
                }
                else if (keccak256(abi.encodePacked(_chosenPenalty)) == (keccak256(abi.encodePacked("NewEndDateForAgreementAndReductionOfPayment")))){
                    require(_newEndDate > block.timestamp, "New end date must be after current date.");
                    agreement.agreementDates[2] = _newEndDate;
                    agreement.pricingModel.price = _price;
                    agreement.pricingModel.fee = _fee;
                }
            agreement.state = State.Active;
            counter.activeAgreementCount++;
            counter.providerActiveCount[agreement.providerPublicKey]++;
            counter.consumerActiveCount[agreement.consumerPublicKey]++; 
        }    
    }
}
    
library AgreementLib {

    function createAgreement(
        string memory _providerPublicKey,
        string memory _consumerPublicKey,
        string memory _dataExchangeAgreementHash,
        string[2] memory _signatures,
        DataOffering memory dataOffering,
        string memory _purpose,
        uint256[] memory dates,
        IntendedUse memory intendedUse,
        LicenseGrant memory licenseGrant,
        PricingModel memory pricingModel,
        TypeOfData memory typeOfData,
        Counter storage counter
    ) internal returns (Agreement memory agreement)
    {
        agreement.providerPublicKey = _providerPublicKey;
        agreement.consumerPublicKey = _consumerPublicKey;
        agreement.dataExchangeAgreementHash = _dataExchangeAgreementHash;
        agreement.signatures = _signatures;
        agreement.dataOffering.dataOfferingId = dataOffering.dataOfferingId;
        agreement.dataOffering.dataOfferingVersion = dataOffering.dataOfferingVersion;
        agreement.dataOffering.title = dataOffering.title;
        agreement.purpose = _purpose;

        agreement.state = State.Active;
        agreement.agreementDates[0] = dates[0];
        agreement.agreementDates[1] = dates[1];

        require(
            dates[1] >= agreement.agreementDates[0],
            "Start date must be after creation date."
        );
        require(dates[2] > dates[1], "End date must be after start date.");
        agreement.agreementDates[2] = dates[2];
        agreement.intendedUse = intendedUse;
        agreement.licenseGrant = licenseGrant;
        agreement.pricingModel = pricingModel;

        agreement.typeOfData.dataStream = typeOfData.dataStream;
        agreement.typeOfData.personalData = typeOfData.personalData;
       
        counter.activeAgreementCount++;
        counter.providerCount[_providerPublicKey]++;
        counter.consumerCount[_consumerPublicKey]++; 
        counter.providerActiveCount[_providerPublicKey]++;
        counter.consumerActiveCount[_consumerPublicKey]++; 
        counter.dataOfferingCount[dataOffering.dataOfferingId]++;
    
    }

    function terminateAgreement(Agreement storage agreement, bool terminate, Counter storage counter) public {
        if(agreement.agreementDates[2]<=block.timestamp || terminate){ 
            if(agreement.state == State.Active){
                counter.activeAgreementCount--;
                counter.providerActiveCount[agreement.providerPublicKey]--;
                counter.consumerActiveCount[agreement.consumerPublicKey]--;
            }     
            agreement.state = State.Terminated;
        }
    }
}

library GetAgreementsLibrary {
     function getAgreementsByConsumer(Agreement[] storage agreements, string[] memory _consumerPublicKeys, bool active, Counter storage counter) external view returns (Agreement[] memory) {
        uint256 k = 0;
        uint256 length = 0;
        Agreement[] memory consumerAgreements;
        if(active) {
            for(uint j= 0; j < _consumerPublicKeys.length; j++)
                length += counter.consumerActiveCount[_consumerPublicKeys[j]];
            consumerAgreements = new Agreement[](length); 
            for (uint i = 0; i < agreements.length; i++)
                for( uint j= 0; j < _consumerPublicKeys.length; j++)
                     if (agreements[i].state == State.Active && keccak256(abi.encodePacked(agreements[i].consumerPublicKey)) == keccak256(abi.encodePacked(_consumerPublicKeys[j]))){
                        consumerAgreements[k] = agreements[i];
                        k++;
                    }  
        }
        else {
            for(uint j= 0; j < _consumerPublicKeys.length; j++)
                length += counter.consumerCount[_consumerPublicKeys[j]];
            consumerAgreements = new Agreement[](length);
            for (uint i = 0; i < agreements.length; i++)
                for( uint j= 0; j < _consumerPublicKeys.length; j++)
                     if (keccak256(abi.encodePacked(agreements[i].consumerPublicKey)) == keccak256(abi.encodePacked(_consumerPublicKeys[j]))){
                        consumerAgreements[k] = agreements[i];
                        k++;
                    }
        }
        return consumerAgreements;
    }

    function getAgreementsByProvider(Agreement[] storage agreements, string[] memory _providerPublicKeys, bool active, Counter storage counter) external view returns (Agreement[] memory) {
        uint256 k = 0;
        uint256 length = 0;
        Agreement[] memory providerAgreements;
        if(active) {
            for(uint j= 0; j < _providerPublicKeys.length; j++)
                length += counter.providerActiveCount[_providerPublicKeys[j]];
            providerAgreements = new Agreement[](length); 
            for (uint i = 0; i < agreements.length; i++)
                for( uint j= 0; j < _providerPublicKeys.length; j++)
                     if (agreements[i].state == State.Active && keccak256(abi.encodePacked(agreements[i].providerPublicKey)) == keccak256(abi.encodePacked(_providerPublicKeys[j]))){
                        providerAgreements[k] = agreements[i];
                        k++;
                    }  
        }
        else {
            for(uint j= 0; j < _providerPublicKeys.length; j++)
                length += counter.providerCount[_providerPublicKeys[j]];
            providerAgreements = new Agreement[](length);
            for (uint i = 0; i < agreements.length; i++)
                for( uint j= 0; j < _providerPublicKeys.length; j++)
                     if (keccak256(abi.encodePacked(agreements[i].providerPublicKey)) == keccak256(abi.encodePacked(_providerPublicKeys[j]))){
                        providerAgreements[k] = agreements[i];
                        k++;
                    }
        }
        return providerAgreements;
    }
}

library RetrieveAgreementsLibrary {

    function checkActiveAgreements (Agreement[] storage agreements, Counter storage counter) external view returns (Agreement[] memory) {
        Agreement[] memory activeAgreements = new Agreement[](counter.activeAgreementCount); 
        uint k = 0;
        for (uint i = 0; i < agreements.length; i++){
            if(agreements[i].state == State.Active) {   
                activeAgreements[k++] = agreements[i];
            }
        }
        return activeAgreements;
    }

    function checkAgreementsByDataOffering (Agreement[] storage agreements, string memory _dataOffering, Counter storage counter) external view returns (Agreement[] memory) {
        Agreement[] memory dataOfferingAgreements = new Agreement[](counter.dataOfferingCount[_dataOffering]);
        uint k = 0;
        for (uint i = 0; i < agreements.length; i++){
            if (keccak256(abi.encodePacked(agreements[i].dataOffering.dataOfferingId)) == keccak256(abi.encodePacked(_dataOffering))) {
                dataOfferingAgreements[k++] = agreements[i];
            }
        }
        return dataOfferingAgreements;
    }

    function retrieveAgreements (Agreement[] storage agreements, string memory _consumerPublicKey, Counter storage counter) external view returns (Agreement[] memory, uint256 k) {

        Agreement[] memory consumerPublicKeyAgreements = new Agreement[](counter.consumerActiveCount[_consumerPublicKey]);
     
        for (uint i = 0; i < agreements.length; i++){
            if (agreements[i].state == State.Active && agreements[i].agreementDates[1]<=block.timestamp && keccak256(abi.encodePacked(agreements[i].consumerPublicKey)) == keccak256(abi.encodePacked(_consumerPublicKey))) {
                consumerPublicKeyAgreements[k++] = agreements[i];
            }
        }
        return (consumerPublicKeyAgreements, k);
    }
}

contract DataSharingAgreement {

    using AgreementLib for Agreement;

    using AgreementLib for Counter;
    
    using RetrieveAgreementsLibrary for Agreement;

    using GetAgreementsLibrary for Agreement;
    
    using AgreementViolationLibrary for Agreement;

    Counter counter;

    Agreement[] public agreements;

    mapping (string => bool) isPublicKeyProvider;
    mapping (string => bool) isPublicKeyConsumer;

    event AgreementActive(string providerPublicKey, string consumerPublicKey, uint256 id);
    event PenaltyChoices(string consumerPublicKey, uint256 id, string[3] penaltyChoices);
    event AgreeOnPenalty(string providerPublicKey, string consumerPublicKey, uint256 id, string chosenPenalty, uint256 newEndDate, uint256 price, uint256 fee);
    event AgreementTerminated(string providerPublicKey, string consumerPublicKey,uint256 id);

    function createAgreement(
        string memory _providerPublicKey,
        string memory _consumerPublicKey,
        string memory _dataExchangeAgreementHash,
        string[2] memory _signatures,
        DataOffering memory dataOffering,
        string memory _purpose,
        uint256[] memory dates,
        IntendedUse memory intendedUse,
        LicenseGrant memory licenseGrant,
        PricingModel memory pricingModel,
        TypeOfData memory typeOfData
    ) public {
        require (isPublicKeyProvider[_providerPublicKey] == false, "Provider pK should be unique.");
        require (isPublicKeyConsumer[_consumerPublicKey] == false, "Consumer pK should be unique.");
        Agreement memory agreement = AgreementLib.createAgreement(
            _providerPublicKey,
            _consumerPublicKey,
            _dataExchangeAgreementHash,
            _signatures,
            dataOffering,
            _purpose,
            dates,
            intendedUse,
            licenseGrant,
            pricingModel,
            typeOfData,
            counter
        );
        agreement.agreementId = agreements.length;
        agreements.push(agreement);
        isPublicKeyProvider[_providerPublicKey] = true;
        isPublicKeyConsumer[_consumerPublicKey] = true;
        emit AgreementActive(_providerPublicKey, _consumerPublicKey, agreements.length - 1);
    }

    function getAgreement(uint256 id) public view returns (Agreement memory) {
        return agreements[id];
    }

    function getAgreementsLength() public view returns (uint256) {
        return agreements.length;
    } 

    function retrievePricingModel(uint256 _agreementId) public view returns (PricingModel memory){
        return agreements[_agreementId].pricingModel;
    }

    function getState(uint256 id) public view returns (State) {
        return agreements[id].state;
    } 

    function checkActiveAgreements() public view returns(Agreement[] memory) {
        Agreement[] memory activeAgreements = RetrieveAgreementsLibrary.checkActiveAgreements(agreements, counter);
        return activeAgreements;
    }

     function getAgreementsByProvider(string[] memory _providerPublicKeys, bool active) public view returns(Agreement[] memory) {
        Agreement[] memory agreementsByProvider = GetAgreementsLibrary.getAgreementsByProvider(agreements,_providerPublicKeys, active, counter);
        return agreementsByProvider;
    }
   
    function getAgreementsByConsumer(string[] memory _consumerPublicKeys, bool active) public view returns(Agreement[] memory) {
        Agreement[] memory agreementsByConsumer = GetAgreementsLibrary.getAgreementsByConsumer(agreements,_consumerPublicKeys, active, counter);
        return agreementsByConsumer;
    }

     function checkAgreementsByDataOffering(string memory _dataOfferingId) public view returns(Agreement[] memory) {
        Agreement[] memory agreementsByDataOffering = RetrieveAgreementsLibrary.checkAgreementsByDataOffering(agreements,_dataOfferingId, counter);
        return agreementsByDataOffering;
    }

    function retrieveAgreements(string memory _consumerPublicKey) external view returns (Agreement[] memory, uint256 k) {
        return RetrieveAgreementsLibrary.retrieveAgreements(agreements,_consumerPublicKey, counter);
    }

    function evaluateSignedResolution(uint256 _agreementId, string memory _proofType, string memory _type, string memory _resolution,
                                string memory _dataExchangeId, uint256 _iat, string memory _iss, string memory _sub) public{ 

      AgreementViolationLibrary.evaluateResolution(agreements[_agreementId], _proofType, _type, _resolution, _dataExchangeId, _iat, _iss, _sub, counter);
      emit PenaltyChoices(agreements[_agreementId].consumerPublicKey, _agreementId, agreements[_agreementId].violation.penaltyChoices);
    }

   

    function terminateAgreement(uint256 _agreementId, bool terminate) public{ 
      AgreementLib.terminateAgreement(agreements[_agreementId], terminate, counter);
      if(agreements[_agreementId].state == State.Terminated){
            emit AgreementTerminated(agreements[_agreementId].providerPublicKey, agreements[_agreementId].consumerPublicKey, _agreementId); 
      }
	}

    function enforcePenalty ( uint256 _id, string memory _chosenPenalty, uint256 _price, uint256 _fee, uint256 _newEndDate) public {
        require((agreements[_id].state == State.Violated), "Agreement must be violated in order to enforce penalty");
        if(keccak256(abi.encodePacked(_chosenPenalty)) == keccak256(abi.encodePacked("Terminate"))){
            terminateAgreement(_id, true);
        }
        else{
            AgreementViolationLibrary.enforcePenalty (agreements[_id], _chosenPenalty, _price, _fee, _newEndDate, counter);
            emit AgreeOnPenalty(agreements[_id].providerPublicKey, agreements[_id].consumerPublicKey,
                 agreements[_id].agreementId, _chosenPenalty, _newEndDate,_price, _fee);
        }
        
    }

    function notifyConsentRevoked( string memory _dataOfferingId) public view returns (string[] memory) {    
        string[] memory consumers = new string[](counter.dataOfferingCount[_dataOfferingId]); 
        uint256 k = 0; 
        for (uint i = 0; i < agreements.length; i++){
            if (keccak256(abi.encodePacked(agreements[i].dataOffering.dataOfferingId)) == keccak256(abi.encodePacked(_dataOfferingId))) {
                consumers[k++]=agreements[i].consumerPublicKey; 
            }
        }
        return consumers;
    }
}
