  import React from 'react';
  import ReactDOM from 'react-dom';
  import App from './App.tsx';
  import {Amplify} from 'aws-amplify'
  import aws_config from './aws-exports.js';

  Amplify.configure(aws_config)
  ReactDOM.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>,
  document.getElementById('root'))

