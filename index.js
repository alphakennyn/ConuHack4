import React from 'react';
import ReactDOM from 'react-dom';
import './website/src/index.css';
import App from './website/src/App.js';
import * as serviceWorker from './website/src/serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
