var presale_abi = require("./ABI/PresaleFactory.json");
var pMagic_abi = require("./ABI/pMagic.json");
var Magic_abi = require('./ABI/Magic.json')
var Avax_abi = require("./ABI/Avax.json");
var usdc_abi = require("./ABI/USDC.json");
var avaxMagic_abi = require("./ABI/avaxMagic.json");
var joerouter_abi = require("./ABI/joerouter_abi.json");
var dashboard_abi = require("./ABI/dashboard.json");

export const config = {
    chainId: 43114, //Fuji testnet : 43113, mainnet : 43114.  bsctestnet : 97, Rikeby: 4
    mainNetUrl: 'https://api.avax.network/ext/bc/C/rpc',
    // mainNetUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    // mainNetUrl: 'https://rinkeby.infura.io/v3/',
    pMagicAddress: '0xb181b06A1E4BFE577E5aA913530C23d35158a6eD',
    pMagicAbi: pMagic_abi,
    PresaleFactoryAddress : "0x82BF08845c501F1e3C4A698C5b26baD4bdaF54aa", // Avalanche
    PresaleFactoryAbi : presale_abi,
    AvaxAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // Avalanche
    AvaxAbi: Avax_abi,
    MagicAddress: '0xbfa425cFb99d3829D03A896F6011b3702aEBEe13', // Avalanche - 0x9d77cceEBDA1De9A6E8517B4b057c1c2F89C8444
    MagicAbi: Magic_abi,
    USDCAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // Avalanche
    USDCAbi: usdc_abi,    
    JoeRouterAddress: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
    JoeRouterAbi : joerouter_abi,
    JoeFactoryAddress: '0x9ad6c38be94206ca50bb0d90783181662f0cfa10',    
    avaxMagicPair: "0x7de9d08b1281455aC2D2C6f30ad3B1C9e954b608", // <- AVAX:MAGIC Avalanche - Test USDC:MAGIC 0xfd9eA09A1F205ba6e147096181F7Fb71528c6451
    avaxMagicAbi: avaxMagic_abi,
    dashboardAddress: '0x8683a4c24f09d550ab60C725260Ba5a4319aD853',
    dashboardAbi: dashboard_abi,
    INFURA_ID: 'e6943dcb5b0f495eb96a1c34e0d1493e'
}

export const def_config = {
    REBASE_RATE: 0.0004,
    DPR: 0.0194,
    APY: 1103.8935,
    SWAP_FEE: 0.053,
    AUTO_SLIPPAGE: 1,
    DAILY_CLAIM: 1,
    BUY_FEE: 0.15,
    SELL_FEE: 0.3,
    DEF_PRICE: 0.01,
    ASTRO_DIGIT: 2,
    MAX_PRESALE_AMOUNT: 50000000
}