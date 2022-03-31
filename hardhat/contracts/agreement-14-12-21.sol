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

pragma solidity 0.8.9;

contract DataSharingAgreement {
    enum State { Created, Active, Updated, Violated, Terminated }
    enum ViolationType { DataIncomplete, DataIncorrect, DataTampered, KeyInvalid, PaymentTooMuch, PaymentIncorrect }

    struct Agreement {
        string dataOfferingId; 
        string purpose;
        State state;
        string providerId;
        string consumerId;
        uint256[3] agreementDates;
        DescriptionOfData descriptionOfData;
        IntendedUse intendedUse;
        LicenseGrant licenseGrant;
        bool dataStream;
        bool signed;
        Violation violation;
    }

    struct DescriptionOfData {
        string dataType;
        string dataFormat;
        string dataSource;
    }
    
    struct IntendedUse {
        bool processData;
        bool shareDataWithThirdParty;
        bool editData;
    }
    
    struct LicenseGrant {
        bool copyData;
        bool transferable;
        bool exclusiveness;
        bool revocable;
    }
    
    struct Violation {
        ViolationType violationType;
        string issuerId;
    }

    Agreement[] public agreements;

    uint256 activeAgreementCount;
    mapping (string => uint) providerCount;
    mapping (string => uint) consumerCount;

    event AgreementCreated(string providerId, string consumerId, uint256 id);
    event AgreementUpdated(string providerId, string consumerId, uint256 id);
    event AgreementSigned(string providerId, string consumerId, uint256 id);
    event AgreementTerminated(string providerId, string consumerId,uint256 id);

    function createAgreement(
                            string memory _dataOfferingId,
                            string memory _purpose,
                            string memory _providerId,
                            string memory _consumerId,
                            uint256[] memory dates,
                            DescriptionOfData memory descriptionOfData,
                            IntendedUse memory intendedUse,
                            LicenseGrant memory licenseGrant,
                            bool _dataStream) public {
                            
        Agreement memory newAgreement;
        newAgreement.dataOfferingId = _dataOfferingId;
        newAgreement.purpose = _purpose;
        newAgreement.providerId = _providerId;
        newAgreement.consumerId = _consumerId;
    
        newAgreement.state = State.Created;
        newAgreement.agreementDates[0] = block.timestamp; 
        newAgreement.agreementDates[1] = dates[0];
     
        require ( dates[0] >= newAgreement.agreementDates[0], "Start date must be after creation date." );
        require ( dates[1] > dates[0], "End date must be after start date." );
        newAgreement.agreementDates[2] = dates[1];
        
        newAgreement.descriptionOfData.dataType = descriptionOfData.dataType;
        newAgreement.descriptionOfData.dataFormat = descriptionOfData.dataFormat;
        newAgreement.descriptionOfData.dataSource = descriptionOfData.dataSource;
        
        newAgreement.intendedUse.processData = intendedUse.processData;
        newAgreement.intendedUse.shareDataWithThirdParty = intendedUse.shareDataWithThirdParty;
        newAgreement.intendedUse.editData = intendedUse.editData;
        
        newAgreement.licenseGrant.copyData = licenseGrant.copyData;
        newAgreement.licenseGrant.transferable = licenseGrant.transferable;
        newAgreement.licenseGrant.exclusiveness = licenseGrant.exclusiveness;
        newAgreement.licenseGrant.revocable = licenseGrant.revocable;
        
        newAgreement.dataStream = _dataStream;
        
        agreements.push(newAgreement);

        providerCount[_providerId]++;
        consumerCount[_consumerId]++;
        
        emit AgreementCreated(_providerId, _consumerId, agreements.length - 1);
    }
    
    function updateAgreement(uint256 _id,
                            string memory _dataOfferingId,
                            string memory _purpose,
                            string memory _providerId,
                            string memory _consumerId,
                            uint256[] memory dates,
                            DescriptionOfData memory descriptionOfData,
                            IntendedUse memory intendedUse,
                            LicenseGrant memory licenseGrant,
                            bool _dataStream) public {
       
        Agreement storage agreement = agreements[_id];  

        require (keccak256(abi.encodePacked(agreements[_id].providerId)) == keccak256(abi.encodePacked(_providerId)), "Only the provider of this agreement can update." ); 
        
        if(agreement.state == State.Active)
        {
            agreement.dataOfferingId = _dataOfferingId;
            agreement.purpose = _purpose;
            agreement.providerId = _providerId; 
            agreement.consumerId = _consumerId;
            agreement.agreementDates[1] = dates[0];
     
            require ( dates[0] >= agreement.agreementDates[0], "Start date must be after creation date." );
            require ( dates[1] > dates[0], "End date must be after start date." );
            agreement.agreementDates[2] = dates[1];
        
            agreement.descriptionOfData.dataType = descriptionOfData.dataType;
            agreement.descriptionOfData.dataFormat = descriptionOfData.dataFormat;
            agreement.descriptionOfData.dataSource = descriptionOfData.dataSource;
        
            agreement.intendedUse.processData = intendedUse.processData;
            agreement.intendedUse.shareDataWithThirdParty = intendedUse.shareDataWithThirdParty;
            agreement.intendedUse.editData = intendedUse.editData;
        
            agreement.licenseGrant.copyData = licenseGrant.copyData;
            agreement.licenseGrant.transferable = licenseGrant.transferable;
            agreement.licenseGrant.exclusiveness = licenseGrant.exclusiveness;
            agreement.licenseGrant.revocable = licenseGrant.revocable;
        
            agreement.dataStream = _dataStream;

            agreement.state = State.Updated;
            activeAgreementCount--;

            emit AgreementUpdated(_providerId, _consumerId, _id);
        }
    }
    
    function signAgreement (uint256 _id, string memory _consumerId) public {
        require (keccak256(abi.encodePacked(agreements[_id].consumerId)) == keccak256(abi.encodePacked(_consumerId)), "Only the consumer of this agreement can sign." );
    
        agreements[_id].signed = true;

        if(agreements[_id].agreementDates[2]>=block.timestamp) {
            agreements[_id].state = State.Active;
            activeAgreementCount++;
            emit AgreementSigned(agreements[_id].providerId,_consumerId, _id);
        }
        else{
            agreements[_id].state = State.Terminated;
            activeAgreementCount--;
            emit AgreementTerminated(agreements[_id].providerId,_consumerId, _id);
        } 
    }

    function getAgreement(uint256 id) public view returns (Agreement memory) {
        return agreements[id];
    }
 
    function getAgreements() public view returns (Agreement[] memory) {
        return agreements;
    }

     function getAgreementsLength() public view returns (uint256) {
        return agreements.length;
    } 

     function getState(uint256 id) public view returns (State) {
        return agreements[id].state;
    } 
    
    function checkActiveAgreements () external view returns (Agreement[] memory) {
        Agreement[] memory activeAgreements = new Agreement[](activeAgreementCount);
        uint counter = 0;
        for (uint i = 0; i < agreements.length; i++){
            if(agreements[i].state == State.Active) {   
                activeAgreements[counter] = agreements[i];
                counter++;
            }
        }
        return activeAgreements;
    }
    
    function checkAgreementsByProvider (string memory _providerId) external view returns (Agreement[] memory) {
        Agreement[] memory providerAgreements = new Agreement[](providerCount[_providerId]);
        uint counter = 0;
        for (uint i = 0; i < agreements.length; i++){
            if (keccak256(abi.encodePacked(agreements[i].providerId)) == keccak256(abi.encodePacked(_providerId))) {
                providerAgreements[counter] = agreements[i];
                counter++;
            }
        }
        return providerAgreements;
    }
    
    function checkAgreementsByConsumer (string memory _consumerId) external view returns (Agreement[] memory) {
        Agreement[] memory consumerAgreements = new Agreement[](consumerCount[_consumerId]);
        uint counter = 0;
        for (uint i = 0; i < agreements.length; i++){
            if (keccak256(abi.encodePacked(agreements[i].consumerId)) == keccak256(abi.encodePacked(_consumerId))) {
                consumerAgreements[counter] = agreements[i];
                counter++;
            }
        }
        return consumerAgreements;
    }
}
