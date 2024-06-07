const MedicalRecord = artifacts.require("MedicalRecord");

module.exports = async function (deployer) {
  await deployer.deploy(MedicalRecord);
};
