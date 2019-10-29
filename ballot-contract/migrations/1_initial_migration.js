const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  deployer.deploy(Migrations, {from:"0x279e4eF7f98b9d89Fe54Eec38c063E5205D0B54D"});
};
