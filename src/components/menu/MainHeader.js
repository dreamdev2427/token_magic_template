import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import { connectWallet, disconnect } from '../../core/web3';
import * as selectors from '../../store/selectors';
import { config } from "../../core/config";

const Header = function ({ navSelected, setIsOpen }) {
  const isMobile = useMediaQuery({ maxWidth: '1024px' });
  const userWalletState = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);
  const pending = useSelector(selectors.loadingState);
  const chainId = useSelector(selectors.authChainID);

  const onConnect = async () => {
    await connectWallet();
  }

  const onDisconnect = async () => {
    await disconnect();
  }

  useEffect(() => {
    if (web3 !== null && chainId !== '' && web3.utils.toHex(chainId) !== web3.utils.toHex(config.chainId)) {
      toast.error('Please change the network to Avalanche.');
    }
  }, [web3, chainId]);

  return (
    <div className='text-gray-100 flex flex-col justify-between' style={{ height: '76px' }}>
      {/* HEADER NAV BAR TOP */}
      {navSelected !== 'Home' && (
        <div className='flex justify-between z-index-9'>
          <div className='flex'>
            {isMobile && (
              <button
                onClick={() => setIsOpen(prevState => !prevState)}
                className='focus:outline-none hover:bg-gray-700 p-2'
              >
                <i className="fa-solid fa-bars fs-20 mx-2"></i>
              </button>
            )}
          </div>
          <div className='flex p-3 px-5 space-x-4'>
            {/* <button
              className='flex border border-white rounded-lg justify-center items-center space-x-2 px-2 hover:bg-slate-700'
              onClick={() => { }}
            >
              <img alt='' className='w-6' src={AvaxIcon} />
              <div className='flex space-x-1 text-sm'>Avalance</div>
            </button> */}

            {web3 !== null && chainId !== '' && web3.utils.toHex(chainId) !== web3.utils.toHex(config.chainId) ? (
              <div className='connect-wal'>
                <button className="text-error" onClick={onConnect}>Switch Network</button>
              </div>
            ) : (chainId === '' || userWalletState === '' || userWalletState === 0 ? (
              <div className='connect-wal'>
                <img alt='' className='w-6 text-white mr-2' src={'img/wallet.png'} />
                <button className='flex' onClick={onConnect}>Connect</button>
              </div>
            ) : (
              <>
                {
                  pending ? (
                    <div className='connect-wal'>
                      <div className="flex gap-1 align-items-center" >
                        <ReactLoading type={'spin'} width="25px" height="25px" color="#fff" />
                        <span className="text-gray">Pending...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="flex flex-column">
                        <div className="connect-wal flex-column">
                          <div className="flex">
                            <img alt='' className='w-6 text-white mr-2' src={'img/wallet.png'} />
                            <span>{userWalletState && (userWalletState.slice(0, 4) + "..." + userWalletState.slice(38))}</span>
                          </div>
                          <button className="btn-disconnect fs-12" onClick={onDisconnect}>Disconnect</button>
                        </div>
                      </div>
                    </div>
                  )}
              </>
            ))}
          </div>
        </div>
      )
      }
      {/* <div className='row'>
        <div className='col-md-12'>
          <ScrollBar />
        </div>
      </div> */}
    </div >
  )
}
export default Header;