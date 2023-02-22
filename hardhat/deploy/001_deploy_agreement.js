module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) => {
  const { deploy } = deployments;
  const [deployer] = await getUnnamedAccounts();
  const agreementLib = await deploy("AgreementLib", {
    from: deployer,
    gasLimit: 12500000,
    args: [],
    chainId: 1337,
    log: true,
  });
  const agreementViolationLibrary = await deploy("AgreementViolationLibrary", {
    from: deployer,
    gasLimit: 12500000,
    args: [],
    chainId: 1337,
    log: true,
  });
  const retrieveAgreementsLibrary = await deploy("RetrieveAgreementsLibrary", {
    from: deployer,
    gasLimit: 12500000,
    args: [],
    chainId: 1337,
    log: true,
  });
  const getAgreementsLibrary = await deploy("GetAgreementsLibrary", {
    from: deployer,
    gasLimit: 12500000,
    args: [],
    chainId: 1337,
    log: true,
  });
  await deploy("DataSharingAgreement", {
    from: deployer,
    gasLimit: 12500000,
    args: [],
    chainId: 1337,
    log: true,
    libraries: {
      AgreementLib: agreementLib.address,
      AgreementViolationLibrary: agreementViolationLibrary.address,
      RetrieveAgreementsLibrary: retrieveAgreementsLibrary.address,
      GetAgreementsLibrary: getAgreementsLibrary.address,
    },
  });
  await deploy("ExplicitUserConsent", {
    from: deployer,
    gasLimit: 12500000,
    args: [],
    chainId: 1337,
    log: true,
  });

};

