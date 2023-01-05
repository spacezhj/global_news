import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter} from "react-router-dom";

import './index.css';
import "./style/common.css"
import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <HashRouter>
        <App/>
    </HashRouter>
);


