import './App.css';
import { useState, useEffect } from 'react';
import { Router, Location, Redirect, useLocation } from '@reach/router';
import { useMediaQuery } from 'react-responsive';
import ScrollToTopBtn from './components/menu/ScrollToTop';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './routes/Home';
import Account from './routes/Account';
import Dashboard from './routes/Dashboard';
import MagicICO from './routes/MagicICO';
import Swap from './routes/Swap';
import NFTSavings from './routes/NFTSavings';
// import Resurrection from './routes/Resurrection';
import AdminICO from './routes/Admin/AdminICO';

import Sidebar from './components/App/Sidebar';
import MainHeader from './components/menu/MainHeader';
import { loadWeb3 } from './core/web3';

export const ScrollTop = ({ children, location }) => {
  useEffect(() => window.scrollTo(0, 0), [location])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const path_list = ['', 'dashboard', 'account', 'swap', 'nft_savings', 'magic_ico', 'magic_control/admin'];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [navSelected, setNavSelected] = useState('');

  const isMobile = useMediaQuery({ maxWidth: '1024px' });
  const location = useLocation();

  useEffect(() => {
    window.addEventListener('load', (event) => {
      AOS.init();
      AOS.refresh();
    });
  }, []);

  useEffect(() => {
    let path_name = location.pathname.replace('/', '');
    if (!path_list.includes(path_name))
      path_name = '';
    setNavSelected(path_name);
  }, [location]);

  useEffect(() => {
    const reloadWeb3 = async () => {
      await loadWeb3();
    }
    reloadWeb3();
  }, []);

  return (
    <div className='app-container relative min-h-screen md:flex' style={{ background: `url(/img/main-back.jpg)` }}>
      {/* SIDEBAR NAV */}
      {navSelected !== '' && (
        <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} />
      )}

      {/* THIS IS OUR CONTENT PAGE */}
      <div
        className={`flex-1 text-white min-h-screen flex-col overflow-hidden ${navSelected !== '' ? 'page-content' : ''}`}

      >
        {/* THIS IS OUR HEADER */}
        {navSelected !== '' && (
          <MainHeader setIsOpen={setIsOpen} navSelected={navSelected} />
        )}
        <div
          className='full-height'
          onClick={() => {
            if (isMobile) {
              setIsOpen(false);
            }
          }}
        >
          <PosedRouter>
            <ScrollTop path="/">
              <Home exact path="/" onSelected={setNavSelected}>
                <Redirect to="/" />
              </Home>
              <Dashboard path="dashboard" />
              <Account path="account" />
              <MagicICO path="magic_ico" />
              <Swap path="swap" />
              <NFTSavings path="nft_savings" />
              {/* <Resurrection path="resurrection"/> */}
              <AdminICO path="magic_control/admin" />
            </ScrollTop>
          </PosedRouter>
        </div>
      </div>
      <ScrollToTopBtn />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </div>
  );
}

export default App;
