import './App.css';
import {useRoutes} from "react-router-dom";
import {UseMenu} from "./router";
import 'antd/dist/reset.css';

const App = () => {
    // @ts-ignore
    const el = useRoutes(UseMenu());
    // console.log(UseMenu())
    return (
        <div className="App">
            {el}
        </div>
    );
}

export default App;
