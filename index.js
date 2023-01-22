const Moralis = require('moralis').default;
const { SolNetwork } = require('@moralisweb3/common-sol-utils');

const runApp = async () => {
  await Moralis.start({
    apiKey: "akUSjEn5ZPKEvdcqeMyL7LC96IGpPmoWt1iXVyJM8B68hXg3h54kn0Z2d0H6hjUB",
    // ...and any other configuration
  });
  
  const address = '12ozzwuTXeTX9jLDKkxFgceequ6FA8MhEm2TVTaNzc59';

  const network = SolNetwork.MAINNET;

  const response = await Moralis.SolApi.account.getSPL({
    address,
    network,
  });
  
  console.log(response.toJSON());
}

runApp();