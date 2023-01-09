import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from "react-router-dom";
import store from "./store/store";
import {Provider} from "react-redux";
import './index.css';
import "./style/common.css"
import App from './App';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <HashRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </HashRouter>
);


