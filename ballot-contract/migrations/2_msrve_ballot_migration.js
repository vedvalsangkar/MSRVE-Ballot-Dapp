const Ballot = artifacts.require("MSRVE_Ballot");

module.exports = function(deployer) {
  deployer.deploy(Ballot, 4, {from:"0x279e4eF7f98b9d89Fe54Eec38c063E5205D0B54D"});
  //deployer.events.allEvents({fromBlock:0}, function(error, event){ console.log(event); });
};
