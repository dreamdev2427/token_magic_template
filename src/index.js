import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import './assets/style.scss';
import './assets/custom.scss';
import './assets/animated.css';
import App from './App';
import { Provider } from 'react-redux';
import { LocationProvider } from '@reach/router';
import store from './store';

ReactDOM.render(
	<Provider store={store}>
		<LocationProvider>
			<App />
		</LocationProvider>
	</Provider>,
	document.getElementById('root'),
);
