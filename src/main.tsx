import React from 'react'
import ReactDOM from 'react-dom/client'
import '@styles/index.scss'
import Router from './common/routers/app.router'
import {BrowserRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import {persistor, store} from '@store/store';
import {LoggerUtil} from './common/utils/logger.util';
import {PersistGate} from 'redux-persist/integration/react';
import 'ant-design-pro/dist/ant-design-pro.css';
import 'antd/dist/reset.css';
import './common/extensions/string.extension';

LoggerUtil.Info('App is running');
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
          <BrowserRouter>
             <Router />
          </BrowserRouter>
      </PersistGate>
    </Provider>
  // </React.StrictMode>,
)
