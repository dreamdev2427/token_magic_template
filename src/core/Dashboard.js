import { config } from "./config";
import store from "../store";
import { parseErrorMsg } from '../components/utils';
const MagicABI = config.MagicAbi;
const MagicAddress = config.MagicAddress;
const DashboardAddress = config.dashboardAddress;
const DashboardABI = config.dashboardAbi;

export const getUserClaimTimes = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const dashContract = new web3.eth.Contract(DashboardABI, DashboardAddress);
    const claimTime = await dashContract.methods.userClaimTimes(accounts[0]).call();
    return {
      success: true,
      claimTime
    }
  } catch (error) {
    console.log('[Claim Times Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const getClaimPeriod = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const dashContract = new web3.eth.Contract(DashboardABI, DashboardAddress);
    const oneWeek = await dashContract.methods.CLAIM_PERIOD().call();
    return {
      success: true,
      oneWeek
    }
  } catch (error) {
    console.log('[Claim Times Error] = ', error);
    return {
      success: false,
      result: "Something went wrong "
    }
  }
}

export const onClaimMagic = async (claimMagic) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }

    const claimAmount = web3.utils.toWei(claimMagic.toString());
    const MagicContract = new web3.eth.Contract(MagicABI, MagicAddress);
    await MagicContract.methods.approve(DashboardAddress, claimAmount).send({ from: accounts[0] });

    const dashContract = new web3.eth.Contract(DashboardABI, DashboardAddress);
    const claim = dashContract.methods.claimASTRO();
    await claim.estimateGas({ from: accounts[0] });
    await dashContract.methods.claimASTRO().send({ from: accounts[0] });
    return {
      success: true,
    }
  } catch (error) {
    console.log('[Claim Times Error] = ', error);
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}