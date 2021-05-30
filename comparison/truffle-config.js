require('dotenv').config();
//const mnemonic = process.env.MNEMONIC;
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

const HDWalletProvider = require("truffle-hdwallet-provider");
// Create your own key for Production environments (https://infura.io/)
const INFURA_ID = process.env.INFURA_ID || 'a3821688f8ce42888e84059f9d97b03a';


const configNetwok = (network, networkId, path = "m/44'/60'/0'/0/", gas = 4465030, gasPrice = 1e10) => ({
  provider: () => new HDWalletProvider(
    mnemonic, `https://${network}.infura.io/v3/${INFURA_ID}`,
        0, 1, true, path
    ),
  networkId,
  gas,
  gasPrice,
});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.matic.today`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    ropsten: configNetwok('ropsten', 3),
    kovan: configNetwok('kovan', 42),
    rinkeby: configNetwok('rinkeby', 4),
    main: configNetwok('mainnet', 1),
  },
};
