import Web3Modal from 'web3modal';
import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from 'ethers';
import { config } from "./config";
import store from "../store";
import { setChainID, setWalletAddr, setBalance, setWeb3 } from '../store/actions';
import { parseErrorMsg } from '../components/utils';
const PresaleFactoryABI = config.PresaleFactoryAbi;
const PresaleFactoryAddress = config.PresaleFactoryAddress;
const MagicABI = config.MagicAbi;
const MagicAddress = config.MagicAddress;
const AvaxAddress = config.AvaxAddress;
const USDCABI = config.USDCAbi;
const USDCAddress = config.USDCAddress;
const JOEABI = config.JoeRouterAbi;
const JOEAddress = config.JoeRouterAddress;
const AvaxMagicPairAddress = config.avaxMagicPair;
const AvaxMagicPairABI = config.avaxMagicAbi;

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: config.INFURA_ID, // required
          rpc: {
            43114: config.mainNetUrl,
          },
        },
      },
    }, // required
    theme: "dark",
  });
}

export let provider = null;
export let web3Provider = null;

export const loadWeb3 = async () => {
  try {
    // await web3Modal.updateTheme({
    //   background: "rgb(39, 49, 56)",
    //   main: "rgb(199, 199, 199)",
    //   secondary: "rgb(136, 136, 136)",
    //   border: "rgba(195, 195, 195, 0.14)",
    //   hover: "rgb(16, 26, 32)"
    // });
    // await web3Modal.clearCachedProvider();
    let web3 = new Web3(config.mainNetUrl);
    store.dispatch(setWeb3(web3));

    provider = await web3Modal.connect();
    web3 = new Web3(provider);
    store.dispatch(setWeb3(web3));

    web3Provider = new providers.Web3Provider(provider);
    const network = await web3Provider.getNetwork();
    store.dispatch(setChainID(network.chainId));

    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();
    store.dispatch(setWalletAddr(account));

    await getBalanceOfAccount();
    provider.on("accountsChanged", async function (accounts) {
      if (accounts[0] !== undefined) {
        store.dispatch(setWalletAddr(accounts[0]));
        await getBalanceOfAccount();
      } else {
        store.dispatch(setWalletAddr(''));
      }
    });

    provider.on('chainChanged', function (chainId) {
      store.dispatch(setChainID(chainId));
    });

    provider.on('disconnect', function (error) {
      store.dispatch(setWalletAddr(''));
    });
  } catch (error) {
    console.log('[Load Web3 error] = ', error);
  }
}

export const disconnect = async () => {
  await web3Modal.clearCachedProvider();
  const web3 = new Web3(config.mainNetUrl);
  store.dispatch(setWeb3(web3));
  store.dispatch(setChainID(''));
  store.dispatch(setWalletAddr(''));
  store.dispatch(setBalance({
    avaxBalance: '',
    usdcBalance: '',
    magicBalance: ''
  }));
}

export const checkNetwork = async () => {
  if (web3Provider) {
    const network = await web3Provider.getNetwork();
    store.dispatch(setChainID(network.chainId));
    return checkNetworkById(network.chainId);
  }
}

export const checkNetworkById = async (chainId) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  if (web3.utils.toHex(chainId) !== web3.utils.toHex(config.chainId)) {
    await changeNetwork();
    return false;
  } else {
    return true;
  }
}

const changeNetwork = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: web3.utils.toHex(config.chainId) }],
    });
    await getBalanceOfAccount();
  }
  catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: web3.utils.toHex(config.chainId),
              chainName: 'Avalanche',
              rpcUrls: [config.mainNetUrl] /* ... */,
            },
          ],
        });
        return {
          success: true,
          message: "switching succeed"
        }
      } catch (addError) {
        return {
          success: false,
          message: "Switching failed." + addError.message
        }
      }
    }
  }
}

export const connectWallet = async () => {
  try {
    provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    store.dispatch(setWeb3(web3));
    web3Provider = new providers.Web3Provider(provider);

    await checkNetwork();
    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();

    if (account !== undefined) {
      store.dispatch(setWalletAddr(account));
    }

    await getBalanceOfAccount();
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      address: "",
      status: "Something went wrong: " + err.message,
    };
  }
};

export const getBalanceOfAccount = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    let avaxBalance = await web3.eth.getBalance(accounts[0]);
    avaxBalance = web3.utils.fromWei(avaxBalance);

    const UsdcContract = new web3.eth.Contract(USDCABI, USDCAddress);
    let usdcBalance = await UsdcContract.methods.balanceOf(accounts[0]).call();
    usdcBalance = web3.utils.fromWei(usdcBalance, 'mwei');

    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    let magicBalance = await MagicContract.methods.balanceOf(accounts[0]).call();
    magicBalance = web3.utils.fromWei(magicBalance);

    store.dispatch(setBalance({
      avaxBalance,
      usdcBalance,
      magicBalance
    }));
    return {
      success: true,
      avaxBalance,
      usdcBalance,
      magicBalance
    }
  } catch (error) {
    console.log('[Get Balance] = ', error);
    return {
      success: false,
      result: "Something went wrong: "
    }
  }
}

export const compareWalllet = (first, second) => {
  if (!first || !second) {
    return false;
  }
  if (first.toUpperCase() === second.toUpperCase()) {
    return true;
  }
  return false;
}

export const getTotalPresaleAmount = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    let presaleAmount = await MagicContract.methods.balanceOf(PresaleFactoryAddress).call();
    presaleAmount = web3.utils.fromWei(presaleAmount);
    return {
      success: true,
      presaleAmount
    }
  } catch (error) {
    console.log('[TOTAL Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getMaxPresaleCap = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    let maxCap = await PresaleContract.methods.maxCapUSDC().call();
    maxCap = web3.utils.fromWei(maxCap, 'mwei');
    return {
      success: true,
      maxCap
    }
  } catch (error) {
    console.log('[MAX Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getMinPresaleCap = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    let minCap = await PresaleContract.methods.minCapUSDC().call();
    minCap = web3.utils.fromWei(minCap, 'mwei');
    return {
      success: true,
      minCap
    }
  } catch (error) {
    console.log('[MIN Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getStartPresaleTime = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    let start_time = await PresaleContract.methods.start_time().call();
    return {
      success: true,
      start_time
    }
  } catch (error) {
    console.log('[START Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getEndPresaleTime = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    let end_time = await PresaleContract.methods.end_time().call();
    return {
      success: true,
      end_time
    }
  } catch (error) {
    console.log('[END Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getpTokenPriceForUSDC = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    let usdcPrice = await PresaleContract.methods.pTokenPrice_USDC().call();
    usdcPrice = web3.utils.fromWei(usdcPrice, 'mwei');
    return {
      success: true,
      usdcPrice
    }
  } catch (error) {
    console.log('[USDC Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getAVAXForUSDC = async (amountOut) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const path = [];
    path.push(AvaxAddress);
    path.push(USDCAddress);
    const from_decimal = 'mwei';
    const to_decimal = 'ether';
    const JoeContract = new web3.eth.Contract(JOEABI, JOEAddress);
    let amountIn = await JoeContract.methods.getAmountsIn(web3.utils.toWei(amountOut.toString(), from_decimal), path).call();
    return {
      success: true,
      value: web3.utils.fromWei(amountIn[0], to_decimal)
    }
  } catch (error) {
    console.log('[AVAX For USDC Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getUSDCForAVAX = async (amountIn) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const path = [];
    path.push(AvaxAddress);
    path.push(USDCAddress);
    const from_decimal = 'ether';
    const to_decimal = 'mwei';
    const JoeContract = new web3.eth.Contract(JOEABI, JOEAddress);
    let amountOut = await JoeContract.methods.getAmountsOut(web3.utils.toWei(amountIn.toString(), from_decimal), path).call();
    return {
      success: true,
      value: web3.utils.fromWei(amountOut[amountOut.length - 1], to_decimal)
    }
  } catch (error) {
    console.log('[USDC For AVAX Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getUserPaidUSDC = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    let paidUSDC = await PresaleContract.methods.getUserPaidUSDC().call({ from: accounts[0] });
    paidUSDC = web3.utils.fromWei(paidUSDC, 'mwei');
    return {
      success: true,
      paidUSDC
    }
  } catch (error) {
    console.log('[USDC Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const buy_pToken = async (coinAmount, tokenAmount, coinType) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    let decimal = 'ether', nDecimal = 18;
    if (coinType === 1) {
      decimal = 'mwei';
      nDecimal = 6;
    }
    coinAmount = Math.floor(coinAmount * 10 ** nDecimal) / 10 ** nDecimal;
    coinAmount = web3.utils.toWei(coinAmount.toString(), decimal);
    tokenAmount = web3.utils.toWei(tokenAmount.toString());
    if (coinType === 0) {
      const buyTokens = PresaleContract.methods.buyTokensByAVAX();
      await buyTokens.estimateGas({ from: accounts[0], value: coinAmount });
      await PresaleContract.methods.buyTokensByAVAX().send({ from: accounts[0], value: coinAmount });
    } else {
      const UsdcContract = new web3.eth.Contract(USDCABI, USDCAddress);
      await UsdcContract.methods.approve(PresaleFactoryAddress, coinAmount).send({ from: accounts[0] });
      const buyTokens = PresaleContract.methods.buyTokensByUSDC(coinAmount);
      await buyTokens.estimateGas({ from: accounts[0] });
      await PresaleContract.methods.buyTokensByUSDC(coinAmount).send({ from: accounts[0] });
    }
    return {
      success: true
    }
  } catch (error) {
    console.log('[BUY Error] = ', error);
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}

export const setPresaleStartTime = async (_time) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    const startTime = PresaleContract.methods.setStartTime(_time);
    await startTime.estimateGas({ from: accounts[0] });
    await PresaleContract.methods.setStartTime(_time).send({ from: accounts[0] });
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}

export const setPresaleEndTime = async (_time) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    const estimate = PresaleContract.methods.setEndTime(_time);
    await estimate.estimateGas({ from: accounts[0] });
    await PresaleContract.methods.setEndTime(_time).send({ from: accounts[0] });
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}

export const setFeesOnNormalTransfer = async (enabled) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    const estimate = MagicContract.methods.setFeesOnNormalTransfers(enabled);
    await estimate.estimateGas({ from: accounts[0] });
    console.log(enabled)
    await MagicContract.methods.setFeesOnNormalTransfers(enabled).send({ from: accounts[0] });
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}

export const setInitialDistributionFinished = async (enalbed) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    const estimate = MagicContract.methods.setInitialDistributionFinished(enalbed);
    await estimate.estimateGas({ from: accounts[0] });
    await MagicContract.methods.setInitialDistributionFinished(enalbed).send({ from: accounts[0] });
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}

export const setMaxCap = async (_maxCap) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    const maxCap = web3.utils.toWei(_maxCap.toString(), 'mwei');
    console.log('[Max Cap]', maxCap);
    const estimate = PresaleContract.methods.setMaxCapUSDC(maxCap);
    await estimate.estimateGas({ from: accounts[0] });
    await PresaleContract.methods.setMaxCapUSDC(maxCap).send({ from: accounts[0] });
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}

export const setMinCap = async (_minCap) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const PresaleContract = new web3.eth.Contract(PresaleFactoryABI, PresaleFactoryAddress);
    const minCap = web3.utils.toWei(_minCap.toString(), 'mwei');
    console.log('[Min Cap]', minCap);
    const estimate = PresaleContract.methods.setMinCapUSDC(minCap);
    await estimate.estimateGas({ from: accounts[0] });
    await PresaleContract.methods.setMinCapUSDC(minCap).send({ from: accounts[0] });
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}

export const setFeeReceivers = async (data) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    const estimate = MagicContract.methods.setFeeReceivers(data.liquidity_receiver, data.treasury_receiver, data.risk_free_value_receiver, data.operation_receiver, data.x_magic_receiver, data.future_ecosystem_receiver, data.burn_receiver);
    await estimate.estimateGas({ from: accounts[0] });
    await MagicContract.methods.setFeeReceivers(data.liquidity_receiver, data.treasury_receiver, data.risk_free_value_receiver, data.operation_receiver, data.x_magic_receiver, data.future_ecosystem_receiver, data.burn_receiver).send({ from: accounts[0] });
    return {
      success: true
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}


export const setFees = async (data) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    const estimate = MagicContract.methods.setFees(data.fee_kind, data.total, data.liquidity_fee, data.risk_free_value_fee, data.treasury_fee, data.fee_fee, data.operation_fee, data.x_magic_fee, data.burn_fee);
    await estimate.estimateGas({ from: accounts[0] });
    await MagicContract.methods.setFees(data.fee_kind, data.total, data.liquidity_fee, data.risk_free_value_fee, data.treasury_fee, data.fee_fee, data.operation_fee, data.x_magic_fee, data.burn_fee).send({ from: accounts[0] });
    return {
      success: true
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}

export const getMagicPriceInWeb3 = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    // const path = [];
    // path.push(MagicAddress);
    // path.push(AvaxAddress);
    // path.push(USDCAddress);
    // const from_decimal = 'ether';
    // const to_decimal = 'mwei';
    // const JoeContract = new web3.eth.Contract(JOEABI, JOEAddress);
    // let amountOut = await JoeContract.methods.getAmountsOut(web3.utils.toWei('1', from_decimal), path).call();
    return {
      success: true,
      magicPrice: 0.03 // web3.utils.fromWei(amountOut[amountOut.length - 1], to_decimal)
    }
  } catch (error) {
    console.log('[USDC Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getRebaseFrequency = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    let rebaseFrequency = await MagicContract.methods.rebaseFrequency().call();
    return {
      success: true,
      rebaseFrequency
    }
  } catch (error) {
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getNextRebase = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    let nextRebase = await MagicContract.methods.nextRebase().call();
    return {
      success: true,
      nextRebase
    }
  } catch (error) {
    console.log('[Next] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getMarketCap = async (magicPrice) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    let supply = await MagicContract.methods.getCirculatingSupply().call();
    supply = web3.utils.fromWei(supply);
    const marketCap = supply * magicPrice;
    return {
      success: true,
      marketCap
    }
  } catch (error) {
    console.log('[MarketCap] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getTotalEarned = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    let initialBalance = await MagicContract.methods.initialBalanceOf(accounts[0]).call();
    initialBalance = web3.utils.fromWei(initialBalance);
    let totalBalance = await MagicContract.methods.balanceOf(accounts[0]).call();
    totalBalance = web3.utils.fromWei(totalBalance);
    const total_earned = 0; // Number(totalBalance) - Number(initialBalance);
    const earned_rate = 0; // Number(initialBalance) <= 0 ? 0 : total_earned * 100 / Number(initialBalance);
    return {
      success: true,
      total_earned,
      earned_rate
    }
  } catch (error) {
    console.log('[Total Earned] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}