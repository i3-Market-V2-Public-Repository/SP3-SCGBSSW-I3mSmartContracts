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

import "./Agreement.sol";

contract ExplicitUserConsent {

    struct Consent {
        string dataOfferingId;
        string consentSubject;
        address consentOperator;
        string consentFormHash;
        uint256 startDate;
        uint256 endDate;
        uint256 status;
    }

    mapping(string => Consent[]) consents;

    event ConsentGiven(string dataOfferingId, string[] consentSubjects);
    event ConsentRevoked(string[] consumers, string dataOfferingId, string[] consentSubjects);

    function giveConsent(
        string memory _dataOfferingId,
        string[] memory _consentSubjects,
        string memory _consentFormHash,
        uint256 _startDate,
        uint256 _endDate
    ) public {
        require(_startDate>=block.timestamp);
        require(_endDate>=_startDate);
        for(uint256 i=0; i< _consentSubjects.length; i++) {
            Consent memory consent;
            consent.dataOfferingId = _dataOfferingId;
            consent.consentSubject = _consentSubjects[i];
            consent.consentOperator = msg.sender;
            consent.consentFormHash = _consentFormHash;
            consent.startDate = _startDate;
            consent.endDate = _endDate;
            consent.status = _endDate; 

            consents[_dataOfferingId].push(consent);
        }
        emit ConsentGiven(_dataOfferingId, _consentSubjects);
    }


    function checkConsentStatus(string memory _dataOfferingId, string memory _consentSubject)
        external
        view
        returns (uint256[] memory) 
    {
        Consent[] memory consentsByDataOffering = consents[_dataOfferingId];
        uint256 length = consentsByDataOffering.length;
        uint256[] memory consentsStatus;
        uint256 k = 0;

        bytes memory emptyString = bytes(_consentSubject); 
        if (emptyString.length == 0) {
            consentsStatus = new uint256[](length);
            for (uint256 i = 0; i < length; i++) {                 
                if (block.timestamp > consentsByDataOffering[i].endDate){ 
                    consentsByDataOffering[i].status = 0; 
                }
                 consentsStatus[k++] = consentsByDataOffering[i].status;
            }
        }
        else {
            consentsStatus = new uint256[](1);
            for (uint256 i = length-1; i >= 0; i--) {
                if (block.timestamp > consentsByDataOffering[i].endDate){
                    consentsByDataOffering[i].status = 0; 
                }
                if(keccak256(abi.encodePacked(consentsByDataOffering[i].consentSubject)) == keccak256(abi.encodePacked(_consentSubject))){
                    consentsStatus[k++] = consentsByDataOffering[i].status;
                    break;
                }
            }       
        }
        
        return consentsStatus;
    }

    function revokeConsent( address _addr, string memory _dataOfferingId, string[] memory _consentSubjects) public {

        Consent[] memory consentsByDataOffering = consents[_dataOfferingId];
        uint256 length = consentsByDataOffering.length;
        if (_consentSubjects.length == 0) {
            for (uint256 i = 0; i < length; i++) {
                require(consents[_dataOfferingId][i].consentOperator == msg.sender);
                consents[_dataOfferingId][i].status = 0;
            }
        } else {
            for (uint256 i = 0; i < length; i++) {
                require(consents[_dataOfferingId][i].consentOperator == msg.sender);
                for (uint256 j = 0; j < _consentSubjects.length; j++)
                    if (keccak256(abi.encodePacked(consentsByDataOffering[i].consentSubject)) == keccak256(abi.encodePacked(_consentSubjects[j])))
                        consents[_dataOfferingId][i].status = 0;
            }
        }

        DataSharingAgreement agreement = DataSharingAgreement(_addr);

        string[] memory consumers = agreement.notifyConsentRevoked(_dataOfferingId);

        emit ConsentRevoked(consumers, _dataOfferingId, _consentSubjects);
    }
}
