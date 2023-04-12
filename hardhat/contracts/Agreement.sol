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
        string memory _sub) public{ 

        SignedResolution memory signedResolution = SignedResolution( _proofType, _type, _resolution, _dataExchangeId, _iat, _iss, _sub);

        if(keccak256(abi.encodePacked(signedResolution.resolution)) == keccak256(abi.encodePacked("completed"))){
            delete agreement.violation;
            agreement.state = State.Active;   
        }
        else if(keccak256(abi.encodePacked(signedResolution.resolution)) == keccak256(abi.encodePacked("notCompleted"))) { 
                issueViolation(agreement, ViolationType.DataNotTransferredAsDescribed, signedResolution.sub); 
                agreement.state = State.Violated;    
        }
        else if(keccak256(abi.encodePacked(signedResolution.resolution)) == keccak256(abi.encodePacked("accepted"))){ 
                issueViolation(agreement, ViolationType.DataNotTransferredAsDescribed, signedResolution.sub); 
                agreement.state = State.Violated; 
             }
        else if(keccak256(abi.encodePacked(signedResolution.resolution)) == keccak256(abi.encodePacked("denied"))){
                delete agreement.violation; 
                agreement.state = State.Active; 
        }
    }

    function issueViolation(Agreement storage agreement, ViolationType _violationType, string memory _issuerId) private {
        agreement.violation = Violation(_violationType, _issuerId, ["Terminate", "NewEndDateForAgreement", "NewEndDateForAgreementAndReductionOfPayment"]);
    }

     function getViolation(Agreement storage agreement) public view returns (Violation memory){
        return agreement.violation;
    }
   
    function enforcePenalty (Agreement storage agreement, string memory _chosenPenalty, uint256 _price, uint256 _fee,
                             uint256 _newEndDate) public returns (Agreement storage) {

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
        }  
        return agreement;  
    }
}
    

contract DataSharingAgreement {
    
    using AgreementViolationLibrary for Agreement;
  
    uint256 agreementId;

    mapping (string => bool) isPublicKeyProvider;
    mapping (string => bool) isPublicKeyConsumer;

    mapping (uint256 => Agreement) agreements;
    mapping (string => uint256) consumerKey2agreementId;
    mapping (string => uint256) providerKey2agreementId;
    mapping (string => uint256[]) offeringId2agreementIds;

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
        uint256[3] memory dates,
        IntendedUse memory intendedUse,
        LicenseGrant memory licenseGrant,
        PricingModel memory pricingModel,
        TypeOfData memory typeOfData
    ) public {
        require (isPublicKeyProvider[_providerPublicKey] == false, "Provider pK should be unique.");
        require (isPublicKeyConsumer[_consumerPublicKey] == false, "Consumer pK should be unique.");
        require(dates[1] >= dates[0], "Start date must be after creation date.");
        require(dates[2] > dates[1], "End date must be after start date.");

        agreementId++; 
        agreements[agreementId] = Agreement(
             agreementId,
            _providerPublicKey,
            _consumerPublicKey,
            _dataExchangeAgreementHash,
            _signatures,
            dataOffering,
            _purpose,
            State.Active,
            dates,
            intendedUse,
            licenseGrant,
            typeOfData,
            pricingModel,
            Violation(ViolationType.NotViolated,"",["","",""])   
        );
        
        consumerKey2agreementId[_consumerPublicKey] = agreementId;
        providerKey2agreementId[_providerPublicKey] = agreementId;
        offeringId2agreementIds[dataOffering.dataOfferingId].push(agreementId);
        
        isPublicKeyProvider[_providerPublicKey] = true;
        isPublicKeyConsumer[_consumerPublicKey] = true;

        emit AgreementActive(_providerPublicKey, _consumerPublicKey, agreementId);
    }

    function getAgreement(uint256 id) public view returns (Agreement memory) {
        return agreements[id];
    }

    function retrievePricingModel(uint256 _agreementId) public view returns (PricingModel memory){
        return agreements[_agreementId].pricingModel;
    }

    function getState(uint256 id) public view returns (State) {
        return agreements[id].state;
    } 

    function getAgreementsByConsumer(string memory _consumerPublicKey, bool active) external view returns (Agreement memory consumerAgreement) {
       Agreement memory agreement = agreements[consumerKey2agreementId[_consumerPublicKey]];
       if(active){
            if(agreement.state == State.Active)
                        return agreement;     
       } 
       else
            return agreement;
    }

    function getAgreementsByProvider(string memory _providerPublicKeys, bool active) public view returns(Agreement memory providerAgreement) {
        Agreement memory agreement = agreements[providerKey2agreementId[_providerPublicKeys]];
        if(active){
            if (agreement.state == State.Active)
                return agreement;
        }
        else 
            return agreement;
    }

    function checkAgreementsByDataOffering(string memory _dataOfferingId) public view returns(uint256[] memory) {
       return offeringId2agreementIds[_dataOfferingId];
    }

    function evaluateSignedResolution(uint256 _agreementId, string memory _proofType, string memory _type, string memory _resolution,
                                string memory _dataExchangeId, uint256 _iat, string memory _iss, string memory _sub) public{ 

      AgreementViolationLibrary.evaluateResolution(agreements[_agreementId], _proofType, _type, _resolution, _dataExchangeId, _iat, _iss, _sub);
      emit PenaltyChoices(agreements[_agreementId].consumerPublicKey, _agreementId, agreements[_agreementId].violation.penaltyChoices);
    }

    function terminateAgreement(uint256 _agreementId, bool terminate) public{ 
      if(agreements[_agreementId].agreementDates[2]<=block.timestamp || terminate){  
            agreements[_agreementId].state = State.Terminated;
            emit AgreementTerminated(agreements[_agreementId].providerPublicKey, agreements[_agreementId].consumerPublicKey, _agreementId); 
        }
    }

    function enforcePenalty ( uint256 _id, string memory _chosenPenalty, uint256 _price, uint256 _fee, uint256 _newEndDate) public {
        require((agreements[_id].state == State.Violated), "Agreement must be violated in order to enforce penalty");
        if(keccak256(abi.encodePacked(_chosenPenalty)) == keccak256(abi.encodePacked("Terminate"))){
            terminateAgreement(_id, true);
        }
        else{
            AgreementViolationLibrary.enforcePenalty (agreements[_id], _chosenPenalty, _price, _fee, _newEndDate);
            emit AgreeOnPenalty(agreements[_id].providerPublicKey, agreements[_id].consumerPublicKey,
                 agreements[_id].agreementId, _chosenPenalty, _newEndDate,_price, _fee);
        }
    }

    function notifyConsentRevoked( string memory _dataOfferingId) public view returns (string[] memory) {    

        uint256[] memory agreementIds = offeringId2agreementIds[_dataOfferingId];
       
        string[] memory consumers = new string[](agreementIds.length);
        for (uint i = 0; i < agreementIds.length; i++){
            consumers[i] = agreements[agreementIds[i]].consumerPublicKey;
        }
        return consumers;
    }
}
