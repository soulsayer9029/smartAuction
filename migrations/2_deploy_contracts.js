const smartAuction = artifacts.require('./smartAuction.sol');


module.exports = async function(deployer) {
  await deployer.deploy(smartAuction,20000);
};