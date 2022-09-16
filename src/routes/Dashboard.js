import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import { useSelector } from 'react-redux';
import { Reveal } from 'react-awesome-reveal';
import { createGlobalStyle } from 'styled-components';
import Slider from '@mui/material/Slider';
import * as selectors from '../store/selectors';
import { fadeInRight, fadeInLeft, getUTCNow, numberWithCommas, LoadingSkeleton } from '../components/utils';
import { getMarketCap, getMagicPriceInWeb3 } from '../core/web3';
import { getUserClaimTimes, getClaimPeriod } from '../core/Dashboard';
import { getTokenHolders } from '../core/axios';
import { config, def_config } from '../core/config';

const GlobalStyles = createGlobalStyle`
  .dashboard-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    background-size: cover !important;
    background-position-x: center !important;
    padding: 20px;
    @media only screen and (max-width: 1200px) {
      .col {
        width: 100%;
      }
    }
  }

  .dashboard-title {
    width: fit-content;
    text-overflow: ellipsis;
    white-space: nowrap;
    h3 {
      line-height: 2rem;
    }
  }

  .community-perform {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .calc-card {
    padding: 10px 20px;
    text-align: left;
  }

  .claim-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    p {
      margin: 1px;
      color: rgb(188 195 207);
    }
    .sub-title {
      width: 100%;
      text-align: left;
      color: white;
    }
  }

  .rebase-card {
    padding: 30px 60px;
    @media only screen and (max-width: 1500px) and (min-width: 1200px) {
      padding: 30px 30px;
    }
    @media only screen and (max-width: 768px) {
      padding: 10px;
    }
  }

  .progress-content {
    @media only screen and (max-width: 768px) {
      width: 80% !important;
    }
  }

  .magic-text {
    color: rgb(255, 184, 77) !important;
    font-weight: bold;
    font-size: 24px;
  }

  .rebase-text {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    @media only screen and (min-width: 769px) {
      height: 100%;
    }
  }

  .claim-value {
    color: #4ed047 !important;
    font-size: 22px;
  }
  
  .btn-activity {
    margin-left: 10px;
    margin-right: 10px;
    padding: 14px 70px;
    font-size: 16px;
  }

  .MuiChip-label {
    font-family: "CenturyGothic";
    font-size: 16px;
    letter-spacing: 1px;
  }
  .btn-claim {
    width: calc(100% - 50px);
    justify-content: center;
    margin-left: 25px;
    margin-right: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    @media only screen and (max-width: 1400px) and (min-width: 1200px) {
      flex-direction: column;
      padding: 14px 5px;
    }
    @media only screen and (max-width: 768px) {
      width: calc(100% - 10px);
      margin-left: 5px;
      margin-right: 5px;
    }
    span {
      white-space: nowrap;
    }
  }

  .rebase-bar {
    width: 38%;
    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }

  .rebase-body {
    width: 62%;
    @media only screen and (max-width: 768px) {
      width: 100%;
    }
  }
`;

const Dashboard = (props) => {
  const APY = def_config.APY;
  const DEF_APY = (def_config.APY * 100).toFixed(2);
  const dailyRate = def_config.DPR;
  // const rebaseRate = def_config.REBASE_RATE;
  const defPrice = def_config.DEF_PRICE;
  const balance = useSelector(selectors.userBalance);
  const wallet = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);
  // const [dailyMagic, setDailyMagic] = useState('');
  // const [nextRebaseAmount, setNextRebaseAmount] = useState('');
  // const [totalEarned, setTotalEarned] = useState('');
  // const [earnedRate, setEarnedRate] = useState('');
  const [magicPrice, setMagicPrice] = useState('');
  const [pricePercent, setPricePercent] = useState('');
  const [marketCap, setMarketCap] = useState('');
  // const [claimMagic, setClaimMagic] = useState('');
  const [tokenHolders, setTokenHolders] = useState('');
  const [nextClaimTime, setNextClaimTime] = useState(0);
  const [remainTime, setRemainTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [apy, setAPY] = useState(DEF_APY);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [futurePrice, setFuturePrice] = useState(0);
  const [days, setDays] = useState(30);
  const [initAmount, setInitAmount] = useState(0);
  const [wealth, setWealth] = useState(0);
  const [rewardEst, setRewardEst] = useState(0);
  const [potentialReturn, setPotentialReturn] = useState(0);

  const navigate = useNavigate();

  const initialize = useCallback(async () => {
    console.log('[Wallet] = ', wallet);
    if (!web3) {
      return;
    }
    setLoading(true);
    let nowMagicPrice = 0;
    let oneWeek = 0;
    let result = await getMagicPriceInWeb3();
    if (result.success) {
      nowMagicPrice = result.magicPrice;
      setMagicPrice(result.magicPrice);
      const percent = (Number(nowMagicPrice) - defPrice) / defPrice * 100;
      setPricePercent(percent);
    }
    result = await getTokenHolders();
    if (result.success) {
      setTokenHolders(result.count);
    }
    result = await getMarketCap(nowMagicPrice);
    if (result.success) {
      setMarketCap(result.marketCap);
    }
    // result = await getTotalEarned();
    // if (result.success) {
    //   setTotalEarned(result.total_earned);
    //   setEarnedRate(result.earned_rate);
    // }
    result = await getClaimPeriod();
    if (result.success) {
      oneWeek = result.oneWeek;
    }
    result = await getUserClaimTimes();
    if (result.success) {
      let claimTime = Math.floor(Number(result.claimTime) + Number(oneWeek) - getUTCNow() / 1000);
      if (claimTime <= 0) {
        claimTime = 0;
      }
      setNextClaimTime(claimTime);
    }

    // let amount = Number(balance.magicBalance) * rebaseRate;
    // setNextRebaseAmount(amount);
    // // amount = Number(balance.magicBalance) * 0.01;
    // // setClaimMagic(amount);
    // setDailyMagic(Number(balance.magicBalance) * dailyRate);

    setLoading(false);
  }, [wallet, web3, defPrice]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (nextClaimTime > 0) {
      setRemainTime(nextClaimTime);
    }
  }, [nextClaimTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (remainTime <= 0) setRemainTime(0);
      else setRemainTime(remainTime - 1);
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    setInitAmount((Number(amount) * Number(purchasePrice)));
    setWealth((Number(amount) * Number(magicPrice)));
    const rewards = ((((Number(apy) + 100) / 100) ** (days / 365)) * Number(amount));
    setRewardEst(rewards);
    setPotentialReturn((rewards * Number(futurePrice)));
  }, [amount, apy, purchasePrice, futurePrice, days, magicPrice]);

  const handleSlide = useCallback((event, value) => {
    setDays(value);
  }, []);

  const handleAmount = useCallback((event) => {
    setAmount(event.target.value);
  }, []);

  const handleAPY = useCallback((event) => {
    setAPY(event.target.value);
  }, []);

  const handlePurchasePrice = useCallback((event) => {
    setPurchasePrice(event.target.value);
  }, []);

  const handleFuturePrice = useCallback((event) => {
    setFuturePrice(event.target.value);
  }, []);

  const handleMax = useCallback(() => {
    if (balance.magicBalance !== '')
      setAmount(Number(balance.magicBalance));
    else {
      setAmount(0);
    }
  }, [balance]);

  return (
    <div className='page-container dashboard-container'>
      <GlobalStyles />
      <div className='row full-width'>
        <div className='col col-md-6 col-sm-12 flex flex-column pb-3'>
          <Reveal keyframes={fadeInRight} className='onStep' delay={0} duration={800} triggerOnce>
            <div className='dashboard-title'>
              <span className='fs-18 f-century fw-bold ls-1 mb-2 ms-4'>COMMUNITY PERFORMANCE</span>
            </div>
          </Reveal>
          <Reveal keyframes={fadeInRight} className='onStep' delay={400} duration={1000} triggerOnce>
            <div className='full-card'>
              <div className='row row-gap-2'>
                <div className='col-xl-12 col-lg-12'>
                  <div className='row h-100 justify-between row-gap-2'>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <div className='flex justify-between'>
                          <p className='fs-16'>$MGV Price</p>
                          {/* <p className={Number(pricePercent) >= 0 ? "card-chip fs-12 up" : "card-chip fs-12 down"}>{loading ? <LoadingSkeleton width={45} /> : `${Number(pricePercent) >= 0 ? '+' : '-' + Number(Math.abs(pricePercent)).toFixed(2) + '%'}`}</p> */}
                          <p className={"card-chip fs-12 up"}>0%</p>
                        </div>
                        {/* <p className='card-value mt-3 mb-3'>{loading || magicPrice === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(magicPrice, 4)}</p> */}
                        <p className='card-value mt-3 mb-3'>--</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Market Cap</p>
                        {/* <p className='card-value bold text-white mt-3 mb-3'>{loading || marketCap === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(marketCap)}</p> */}
                        <p className='card-value text-white mt-3 mb-3'>--</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Next Reward</p>
                        <p className='card-value text-white mt-3 mb-3'>--</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Total Holders</p>
                        <p className='card-value text-white mt-3 mb-3'>{loading || tokenHolders === '' ? <LoadingSkeleton /> : numberWithCommas(tokenHolders)}</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Liquidity Value</p>
                        {/* <p className='card-value bold text-white mt-3 mb-3'>{loading || marketCap === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(marketCap)}</p> */}
                        <p className='card-value bold text-white mt-3 mb-3'>--</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Treasury</p>
                        {/* <p className='card-value bold text-white mt-3 mb-3'>{loading || marketCap === '' ? <LoadingSkeleton /> : '$' + numberWithCommas(marketCap)}</p> */}
                        <p className='card-value bold text-white mt-3 mb-3'>--</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>APY</p>
                        <p className='card-value text-white'>{numberWithCommas(APY * 100)}%</p>
                        <p className='card-value type-3'>Daily % Rate (DPR): ~{numberWithCommas(dailyRate * 100)}%</p>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='main-card'>
                        <p className='fs-16'>Total Burned</p>
                        {/* <p className='card-value text-white mt-3 mb-3'>{loading || tokenHolders === '' ? <LoadingSkeleton /> : numberWithCommas(tokenHolders)}</p> */}
                        <p className='card-value text-white mt-3 mb-3'>--</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='full-height flex justify-center align-items-center mb-4'>
                  <a href={`https://dexscreener.com/avalanche/`} className='btn-main btn5 btn-activity' target='_blank' rel="noreferrer">DEX Charts</a>
                  <button className='btn-main btn-activity' onClick={() => navigate('/swap')}>Buy $MGV</button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className='col col-md-6 col-sm-12 flex flex-column pb-3'>
          <Reveal keyframes={fadeInLeft} className='onStep' delay={0} duration={800} triggerOnce>
            <div className='swap-title'>
              <span className='fs-18 f-century fw-bold ls-1 mb-2 ms-4'>WHAT TO DO</span>
            </div>
          </Reveal>
          <Reveal className='full-card full-height onStep' keyframes={fadeInLeft} delay={400} duration={1000} triggerOnce>
            <div className='row text-left justify-between full-height'>
              <div className='col-md-12'>
                <div className='main-card'>
                  <p className='f-semi-b'>Steps to Financial Freedom with $MGV</p>
                  <div className='flex align-items-center gap-2'>
                    <p className='f-century-b fs-22 mb-0' style={{ whiteSpace: 'nowrap' }}>Step 1:</p>
                    <p className='fs-18 mb-0'>---</p>
                  </div>
                  <div className='flex align-items-center gap-2'>
                    <p className='f-century-b fs-22 mb-0' style={{ whiteSpace: 'nowrap' }}>Step 2:</p>
                    <p className='fs-15 mb-0'>---</p>
                  </div>
                  <div className='flex align-items-center gap-2'>
                    <p className='f-century-b fs-22 mb-0' style={{ whiteSpace: 'nowrap' }}>Step 3:</p>
                    <p className='fs-15 mb-0'>---</p>
                  </div>
                </div>
              </div>
              <div className='col-md-12 mt-3'>
                <span className='fs-18 f-century fw-bold ls-1 mt-2 mb-1'>CALCULATOR</span><br />
                <p className='fs-14 text-gray mb-0'>Estimate your returns based on today's performance</p>
              </div>
              <div className='col-md-12'>
                <div className='row'>
                  <div className='col-md-6 pb-3'>
                    <div className='input-form-control'>
                      <label className='input-label'>$MGV Amount</label>
                      <div className="input-control">
                        <input type="number" name="amount" value={amount} className='input-main' onChange={handleAmount}></input>
                        <span className="input-suffix" onClick={handleMax}>MAX</span>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 pb-3'>
                    <div className='input-form-control'>
                      <label className='input-label'>APY (%)</label>
                      <div className="input-control">
                        <input type="number" name="apy" value={apy} className='input-main' onChange={handleAPY}></input>
                        <span className="input-suffix" onClick={() => setAPY(DEF_APY)}>Current</span>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 pb-3'>
                    <div className='input-form-control'>
                      <label className='input-label'>$MGV Price at purchase ($)</label>
                      <div className="input-control">
                        <input type="number" name="purchasePrice" value={purchasePrice} className='input-main' onChange={handlePurchasePrice}></input>
                        <span className="input-suffix" onClick={() => setPurchasePrice(numberWithCommas(magicPrice, 6))}>Current</span>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 pb-3'>
                    <div className='input-form-control'>
                      <label className='input-label'>Future $MGV Price ($)</label>
                      <div className="input-control">
                        <input type="number" name="futurePrice" value={futurePrice} className='input-main' onChange={handleFuturePrice}></input>
                        <span className="input-suffix" onClick={() => setFuturePrice(numberWithCommas(magicPrice, 6))}>Current</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-12 pb-2 px-4'>
                <span className='fs-14'>{days} days</span>
                <Slider
                  size="large"
                  defaultValue={30}
                  value={days}
                  step={1}
                  min={1}
                  max={365}
                  onChange={handleSlide}
                />
              </div>
              <div className='col-md-12 px-4'>
                <div className="flex flex-column gap-2">
                  <div className='flex justify-between'>
                    <label className='calc-label'>Your initial investment</label>
                    <span>${numberWithCommas(initAmount, 5)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <label className='calc-label'>Current wealth</label>
                    <span>${numberWithCommas(wealth, 5)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <label className='calc-label'>$MGV rewards estimation</label>
                    <span>{numberWithCommas(rewardEst, 5)} $MGV</span>
                  </div>
                  <div className='flex justify-between'>
                    <label className='calc-label'>Potential return</label>
                    <span>${numberWithCommas(potentialReturn, 5)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <label className='calc-label'>Potential number of $MGV Journeys</label>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;