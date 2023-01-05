import './App.css';
import {useRoutes} from "react-router-dom";
import {yi} from "./router";
import 'antd/dist/reset.css';

function App() {
    const el = useRoutes(yi);
    return (
        <div className="App">
                {el}
        </div>
    );
}

export default App;
