// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.9;

contract DataSharingAgreement {
    enum State { Created, Active, Terminated }
    //enum Characteristic { Accuracy, Completeness, Reliability, Lawfulness, Updated }
    
    struct Agreement {
        uint256 dataOfferingId; 
        string purpose;
        State state;
        string providerId;
        string consumerId;
        uint256 creationDate;
        uint256 startDate;
        uint256 endDate;
        // Obligations obligations;
        // DescriptionOfData descriptionOfData;
        IntendedUse intendedUse;
        LicenseGrant licenseGrant;
        bool dataStream;
        bool signed;
    }
    
    // struct Obligations {
    //     uint256 qualityOfData;
    //     Characteristic characteristic;
    //     bool dataAvailability;
    // }
    
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

    Agreement[] public agreements;
    
    event AgreementCreated(string providerId, string consumerId, uint256 id);
    event AgreementUpdated(string providerId, string consumerId, uint256 id);
    event AgreementSigned(uint256 id);
    
    function createAgreement(
                            uint256 _dataOfferingId,
                            string memory _purpose,
                            string memory _providerId,
                            string memory _consumerId,
                            uint256[] memory dates,
                            // Obligations memory obligations,
                            // DescriptionOfData memory descriptionOfData,
                            IntendedUse memory intendedUse,
                            LicenseGrant memory licenseGrant,
                            bool _dataStream) public {
                            
        Agreement memory newAgreement;
        newAgreement.dataOfferingId = _dataOfferingId;
        newAgreement.purpose = _purpose;
        newAgreement.providerId = _providerId;
        newAgreement.consumerId = _consumerId;
    
        newAgreement.state = State.Created;
        newAgreement.creationDate = block.timestamp; 
        if(dates[0] <= newAgreement.creationDate) newAgreement.state = State.Active;
        newAgreement.startDate = dates[0];
     
        require ( dates[1] > newAgreement.creationDate, "End date must be after creation date." );
        require ( dates[1] > dates[0], "End date must be after start date." );
        newAgreement.endDate = dates[1];
        
        // newAgreement.obligations.qualityOfData = obligations.qualityOfData;
        // newAgreement.obligations.characteristic = obligations.characteristic;
        // newAgreement.obligations.dataAvailability = obligations.dataAvailability;
        
        // newAgreement.descriptionOfData.dataType = descriptionOfData.dataType;
        // newAgreement.descriptionOfData.dataFormat = descriptionOfData.dataFormat;
        // newAgreement.descriptionOfData.dataSource = descriptionOfData.dataSource;
        
        newAgreement.intendedUse.processData = intendedUse.processData;
        newAgreement.intendedUse.shareDataWithThirdParty = intendedUse.shareDataWithThirdParty;
        newAgreement.intendedUse.editData = intendedUse.editData;
        
        newAgreement.licenseGrant.copyData = licenseGrant.copyData;
        newAgreement.licenseGrant.transferable = licenseGrant.transferable;
        newAgreement.licenseGrant.exclusiveness = licenseGrant.exclusiveness;
        newAgreement.licenseGrant.revocable = licenseGrant.revocable;
        
        newAgreement.dataStream = _dataStream;
        
        agreements.push(newAgreement);
        
        emit AgreementCreated(_providerId, _consumerId, agreements.length - 1);
    }
    
    function updateAgreement(uint256 _id,
                            uint256 _dataOfferingId,
                            string memory _purpose,
                            string memory _providerId,
                            string memory _consumerId,
                            uint256[] memory dates,
                            // DescriptionOfData memory descriptionOfData,
                            IntendedUse memory intendedUse,
                            LicenseGrant memory licenseGrant,
                            bool _dataStream) public {
        
 
        Agreement storage agreement = agreements[_id];   
        agreement.dataOfferingId = _dataOfferingId;
        agreement.purpose = _purpose;
        agreement.providerId = _providerId; 
        agreement.consumerId = _consumerId;
        
        if(dates[0] <= block.timestamp) agreement.state = State.Active;
        agreement.startDate = dates[1];
     
        require ( dates[1] > agreement.creationDate, "End date must be after creation date." );
        require ( dates[1] > dates[0], "End date must be after start date." );
        agreement.endDate = dates[1];
        
        // agreement.descriptionOfData.dataType = descriptionOfData.dataType;
        // agreement.descriptionOfData.dataFormat = descriptionOfData.dataFormat;
        // agreement.descriptionOfData.dataSource = descriptionOfData.dataSource;
        
        agreement.intendedUse.processData = intendedUse.processData;
        agreement.intendedUse.shareDataWithThirdParty = intendedUse.shareDataWithThirdParty;
        agreement.intendedUse.editData = intendedUse.editData;
        
        agreement.licenseGrant.copyData = licenseGrant.copyData;
        agreement.licenseGrant.transferable = licenseGrant.transferable;
        agreement.licenseGrant.exclusiveness = licenseGrant.exclusiveness;
        agreement.licenseGrant.revocable = licenseGrant.revocable;
        
        agreement.dataStream = _dataStream;
        
        emit AgreementUpdated(_providerId, _consumerId, _id);
    }
    
    function signAgreement (uint256 id, string memory _consumerId) public {
        require (keccak256(abi.encodePacked(agreements[id].consumerId)) == keccak256(abi.encodePacked(_consumerId)), "Only the consumer of this agreement can sign." );
       
        agreements[id].signed = true;
        emit AgreementSigned(id);
    }
 
    
    function getAgreement(uint256 id) public view returns (Agreement memory) {
        Agreement storage fetchedAgreement = agreements[id];
        return (fetchedAgreement);
    }
    
    function getState(uint256 id) public view returns (State) {
        Agreement storage fetchedAgreement = agreements[id];
        return (fetchedAgreement.state);
    } 
    
    function checkActiveAgreements () external view returns (Agreement[] memory) {
        Agreement[] memory activeAgreements;
        uint counter = 0;
        for (uint i = 0; i < agreements.length; i++)
            if(agreements[i].state == State.Active) {   
                activeAgreements[counter] = agreements[i];
                counter++;
            }
        return activeAgreements;
    }
    
    function checkAgreementsByProvider (string memory _providerId) external view returns (Agreement[] memory) {
        Agreement[] memory providerAgreements;
        uint counter = 0;
        for (uint i = 0; i < agreements.length; i++)
            if (keccak256(abi.encodePacked(agreements[i].providerId)) == keccak256(abi.encodePacked(_providerId))) {
                providerAgreements[counter] = agreements[i];
                counter++;
            }
        return providerAgreements;
    }
    
    function checkAgreementsByConsumer (string memory _consumerId) external view returns (Agreement[] memory) {
        Agreement[] memory consumerAgreements;
        uint counter = 0;
        for (uint i = 0; i < agreements.length; i++)
            if (keccak256(abi.encodePacked(agreements[i].consumerId)) == keccak256(abi.encodePacked(_consumerId))) {
                consumerAgreements[counter] = agreements[i];
                counter++;
            }
        return consumerAgreements;
    }
}
