module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) => {
  const { deploy } = deployments;
  const [deployer] = await getUnnamedAccounts();
  
  const agreementViolationLibrary = await deploy("AgreementViolationLibrary", {
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
      AgreementViolationLibrary: agreementViolationLibrary.address,
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

