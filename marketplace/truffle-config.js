require('babel-register');
require('babel-polyfill');
require('dotenv').config();
var HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },ropsten: {
      provider: ()=> new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/"+process.env.INFURA_API_KEY),
      network_id: "3" // Match any network id
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        version: '0.5.4',
        enabled: true,
        runs: 200
      }
    }
  }
}
