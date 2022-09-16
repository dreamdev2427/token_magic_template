import React from 'react';
import Reveal from 'react-awesome-reveal';
import { useDispatch } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import moment from 'moment';
import $ from 'jquery';
import { toast } from 'react-toastify';
import {
  setPresaleStartTime,
  setPresaleEndTime,
  setFeesOnNormalTransfer,
  setInitialDistributionFinished,
  setFeeReceivers,
  setFees,
  setMaxCap,
  setMinCap
} from '../../core/web3'
import {
  fadeIn,
  fadeInUp,
  isEmpty,
  // getDate,
  // getUTCDate,
  // getUTCNow,
  // getUTCTimestamp
} from '../../components/utils';
import { showLoader, hideLoader } from "../../store/actions";

const GlobalStyles = createGlobalStyle`
  .ico-container {
    display: flex;
    align-items: center;
    justify-content: start;
    flex-direction: column;
    background-size: cover !important;
    background-position-x: center !important;
    .ico-header {
      max-width: 900px;
      padding: 20px;
      .ico-title {
        font-size: 36px;
      }
      .ico-desc {
        font-size: 20px;
      }
    }
    @media only screen and (max-width: 1400px) {
      flex-direction: column;
    }
    @media only screen and (max-width: 768px) {
      padding: 10px;
      .ico-header {
        padding: 20px;
        .ico-title {
          font-size: 28px;
        }
        .ico-desc {
          font-size: 18px;
        }
      }
    }
  }

  input {
    background: transparent;
	  border: 1px solid white;
    border-radius: 5px;
    font-size: 20px;
    padding: 10px;
    width: 100%;
  }

  .presale-content {
    max-width: 1000px;
    background: rgba(0, 0, 0, 0.2);
    border: solid 1.5px rgba(140, 145, 255, 0.15);
    border-radius: 8px;
    padding: 10px;
    &.main {
      background: linear-gradient(180deg, #291C75 0%, rgba(99, 86, 233, 0) 100%);
    }
  }

  .admin-presale-inner {
    border-radius: 12px;
    padding: 10px 60px 40px;
    position: relative;
    background: transparent;
    h3 {
      line-height: 2;
    }
    @media only screen and (max-width: 1024px) {
      padding: 60px 40px 40px;
    }
    @media only screen and (max-width: 768px) {
      span, button {
        width: 100%;
      }
    }
  }
  
  .gap-row-2 {
    row-gap: 0.5rem;
  }

  .select-date {
    .MuiFormControl-root {
      margin: 0;
    }
    .MuiOutlinedInput-root {
      border: solid 1px white !important;
      background: transparent !important;
      color: white !important;
      &:hover {
        border: solid 1px white !important;
      }
    }
  
    .MuiOutlinedInput-notchedOutline {
      border: none !important;
    }

    .MuiSvgIcon-root {
      color: white !important;
    }
  }
`;


const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '10px 0',
          width: '100%'
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '10px 0',
          width: '100%'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: '#50BFA5',
          borderColor: '#50BFA5',
          outlineColor: '#50BFA5',
          '&:hover': {
            border: 'none'
          }
        },
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            top: '-10px !important',
            color: 'white',
          }
        },
        shrink: {
          color: 'white',
          fontSize: '18px',
          top: '-10px',
          transform: 'translate(14px, -9px) scale(0.75)'
        },
      }
    }
  }
});

const AdminICO = (props) => {
  const [date_start, setDate_start] = React.useState();
  const [date_end, setDate_end] = React.useState(new Date());
  const [feeOnNormal, setFeeOnNormal] = React.useState(true);
  const [initDistribution, setInitDistribution] = React.useState(true);
  const [input_data, setInputData] = React.useState({
    liquidity_receiver: '',
    treasury_receiver: '',
    risk_free_value_receiver: '',
    operation_receiver: '',
    x_magic_receiver: '',
    future_ecosystem_receiver: '',
    burn_receiver: '',
    fee_kind: 0,
    total: '',
    liquidity_fee: '',
    risk_free_value_fee: '',
    treasury_fee: '',
    fee_fee: '',
    operation_fee: '',
    x_magic_fee: '',
    burn_fee: '',
    min_cap: '',
    max_cap: ''
  });

  const dispatch = useDispatch();
  const handleDate_start = (newValue) => {
    setDate_start(newValue);
  };

  const handleDate_end = (newValue) => {
    setDate_end(newValue);
  };

  const handleFeeOnNormal = (event) => {
    setFeeOnNormal(event.target.value === '0' ? false : true);
  }

  const handleInitDistribution = (event) => {
    setInitDistribution(event.target.value === '0' ? false : true);
  }

  const onClick_SetStartDate = async () => {
    dispatch(showLoader());
    const start = Math.floor(moment(date_start).valueOf() / 1000);
    const timezoneOffset = new Date().getTimezoneOffset() * 60;
    const real_time = start - timezoneOffset;
    let result = await setPresaleStartTime(real_time);
    if (result.success) {
      toast.success('Updated the start time successfully.');
    } else {
      toast.error('The transaction has been failed: ' + result.error);
    }
    dispatch(hideLoader());
  }

  const onClick_SetEndDate = async () => {
    dispatch(showLoader());
    const end = Math.floor(moment(date_end).valueOf() / 1000);
    const timezoneOffset = new Date().getTimezoneOffset() * 60;
    const real_time = end - timezoneOffset;
    let result = await setPresaleEndTime(real_time);
    if (result.success) {
      toast.success('Updated the end time successfully.');
    } else {
      toast.error('The transaction has been failed: ' + result.error);
    }
    dispatch(hideLoader());
  }

  const onClick_FeesOnNormal = async () => {
    dispatch(showLoader());
    let result = await setFeesOnNormalTransfer(feeOnNormal);
    if (result.success) {
      toast.success('Updated the value successfully.');
    } else {
      toast.error('The transaction has bee failed: ' + result.error);
    }
    dispatch(hideLoader());
  }

  const onClick_InitDistribution = async () => {
    dispatch(showLoader());
    let result = await setInitialDistributionFinished(initDistribution);
    if (result.success) {
      toast.success('Updated the value successfully.');
    } else {
      toast.error('The transaction has bee failed: ' + result.error);
    }
    dispatch(hideLoader());
  }

  const onClick_MinCap = async () => {
    if (isEmpty(input_data.min_cap) || Number(input_data.min_cap) === 0) {
      $(`input[name='min_cap']`).focus();
      toast.warning('Please insert a valid value');
      return;
    }
    dispatch(showLoader());
    let result = await setMinCap(input_data.min_cap);
    if (result.success) {
      toast.success('Updated the value successfully.');
    } else {
      toast.error('The transaction has bee failed: ' + result.error);
    }
    dispatch(hideLoader());
  }

  const onClick_MaxCap = async () => {
    if (isEmpty(input_data.max_cap) || Number(input_data.max_cap) === 0) {
      $(`input[name='max_cap']`).focus();
      toast.warning('Please insert a valid value');
      return;
    }
    dispatch(showLoader());
    let result = await setMaxCap(input_data.max_cap);
    if (result.success) {
      toast.success('Updated the value successfully.');
    } else {
      toast.error('The transaction has bee failed: ' + result.error);
    }
    dispatch(hideLoader());
  }

  const receiver_Validation = () => {
    let result = true;
    if (isEmpty(input_data.liquidity_receiver)) {
      $(`input[name='liquidity_receiver']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.treasury_receiver)) {
      $(`input[name='treasury_receiver']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.risk_free_value_receiver)) {
      $(`input[name='risk_free_value_receiver']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.operation_receiver)) {
      $(`input[name='operation_receiver']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.x_magic_receiver)) {
      $(`input[name='x_magic_receiver']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.future_ecosystem_receiver)) {
      $(`input[name='future_ecosystem_receiver']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.burn_receiver)) {
      $(`input[name='burn_receiver']`).focus();
      result = false;
    }
    if (!result) {
      toast.warning('Please insert a valid value');
    }
    return result;
  }

  const fee_Validation = () => {
    let result = true;
    if (isEmpty(input_data.fee_kind)) {
      $(`input[name='fee_kind']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.total)) {
      $(`input[name='total']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.liquidity_fee)) {
      $(`input[name='liquidity_fee']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.risk_free_value_fee)) {
      $(`input[name='risk_free_value_fee']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.treasury_fee)) {
      $(`input[name='treasury_fee']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.fee_fee)) {
      $(`input[name='fee_fee']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.operation_fee)) {
      $(`input[name='operation_fee']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.x_magic_fee)) {
      $(`input[name='x_magic_fee']`).focus();
      result = false;
    }
    else if (isEmpty(input_data.burn_fee)) {
      $(`input[name='burn_fee']`).focus();
      result = false;
    }
    if (!result) {
      toast.warning('Please insert a valid value');
    }
    return result;
  }

  const onClick_FeesReceiver = async () => {
    if (!receiver_Validation()) {
      return;
    }
    dispatch(showLoader());
    const result = await setFeeReceivers(input_data);
    if (result.success) {
      toast.success('Updated the value successfully.');
    } else {
      toast.error('The transaction has bee failed: ' + result.error);
    }
    dispatch(hideLoader());
  }

  const onClick_SetFees = async () => {
    if (!fee_Validation()) {
      return;
    }
    dispatch(showLoader());
    const result = await setFees(input_data)
    if (result.success) {
      toast.success('Updated the value successfully.');
    } else {
      toast.error('The transaction has bee failed: ' + result.error);
    }
    dispatch(hideLoader());
  }

  const handleChange = (event) => {
    const inputData = input_data;
    inputData[event.target.name] = event.target.value;
    setInputData(inputData);
  }

  const handleFeeKind = (event) => {
    const inputData = input_data;
    inputData.fee_kind = Number(event.target.value);
    setInputData(inputData);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className='page-container text-center ico-container' style={{ background: `url(/img/main-back.png)` }}>
          <GlobalStyles />
          <div className='ico-header'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
              <p className='ico-title'>Only Owner can change info</p>
            </Reveal>
          </div>
          <Reveal className='onStep' keyframes={fadeIn} delay={800} duration={800} triggerOnce>
            <section className='presale-content'>
              <section className='admin-presale-inner pt-3 pb-4'>
                <div className="row gap-2">
                  <div className='col-md-12'>
                    <div className="admin-input-section select-date">
                      <span className='text-left'>Start Time: </span>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          value={date_start}
                          onChange={handleDate_start}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                      <button className='btn-main btn4' onClick={() => { onClick_SetStartDate() }}>SET</button>
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className="admin-input-section select-date">
                      <span className='text-left'>End Time: </span>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          value={date_end}
                          onChange={handleDate_end}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                      <button className='btn-main btn4' onClick={() => { onClick_SetEndDate() }}>SET</button>
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='admin-input-section'>
                      <span className='text-left'>Min Cap ($USDC)</span>
                      <input name="min_cap" type="number" onChange={handleChange}></input>
                      <button className='btn-main btn4' onClick={() => { onClick_MinCap() }}>SET</button>
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='admin-input-section'>
                      <span className='text-left'>Max Cap ($USDC)</span>
                      <input name="max_cap" type="number" onChange={handleChange}></input>
                      <button className='btn-main btn4' onClick={() => { onClick_MaxCap() }}>SET</button>
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className="admin-input-section">
                      <span className='text-left'>FeesOnNormalTransfer: </span>
                      <select name="fee_on_normal" onChange={handleFeeOnNormal}>
                        <option value='1'>True</option>
                        <option value='0'>False</option>
                      </select>
                      <button className='btn-main btn4' onClick={() => { onClick_FeesOnNormal() }}>SET</button>
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className="admin-input-section">
                      <span className='text-left'>InitialDistribution: </span>
                      <select name="init_distribution" onChange={handleInitDistribution}>
                        <option value='1'>True</option>
                        <option value='0'>False</option>
                      </select>
                      <button className='btn-main btn4' onClick={() => { onClick_InitDistribution() }}>SET</button>
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='row gap-row-2'>
                      <div className='col-md-12 text-left '>
                        <h3 className='full-width mb-1'>Fees Receivers </h3>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Liquidity Receiver</span>
                          <input name="liquidity_receiver" type="text" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Treasury Receiver</span>
                          <input name="treasury_receiver" type="text" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Risk Free Value Receiver</span>
                          <input name="risk_free_value_receiver" type="text" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Operation Receiver</span>
                          <input name="operation_receiver" type="text" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>xASTRO Receiver</span>
                          <input name="x_magic_receiver" type="text" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Future Ecosystem Receiver</span>
                          <input name="future_ecosystem_receiver" type="text" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Burn Receiver</span>
                          <input name="burn_receiver" type="text" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6 flex align-items-center md:justify-end sm:justify-center pt-3'>
                        <button className='btn-main btn4' onClick={onClick_FeesReceiver}>SET</button>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='row gap-row-2'>
                      <div className='col-md-12 text-left '>
                        <h3 className='full-width mb-1'>Fees </h3>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Fee Kind</span>
                          <div className="admin-input-section">
                            <select name="fee_kind" onChange={handleFeeKind}>
                              <option value='0'>Buy</option>
                              <option value='1'>Sell</option>
                              <option value='2'>Whale</option>
                              <option value='3'>Invadator</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Total</span>
                          <input name="total" type="number" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Liquidity Fee</span>
                          <input name="liquidity_fee" type="number" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Risk Free Value</span>
                          <input name="risk_free_value_fee" type="number" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Treasury Fee</span>
                          <input name="treasury_fee" type="number" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Fee Fee</span>
                          <input name="fee_fee" type="number" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Operation Fee</span>
                          <input name="operation_fee" type="number" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>xASTRO Fee</span>
                          <input name="x_magic_fee" type="number" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='flex flex-column'>
                          <span className='text-left'>Burn Fee</span>
                          <input name="burn_fee" type="number" onChange={handleChange}></input>
                        </div>
                      </div>
                      <div className='col-md-6 flex align-items-center md:justify-end sm:justify-center pt-3'>
                        <button className='btn-main btn4' onClick={onClick_SetFees}>SET</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </Reveal>
        </div >
      </ThemeProvider>
    </>
  );
};

export default AdminICO;