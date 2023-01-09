//创建一个store对象
import {legacy_createStore as createStore, applyMiddleware, combineReducers} from "redux";
import login_reducer from "./reducers/login_reducer";
//引入redux-devtools-extension
import {composeWithDevTools} from "redux-devtools-extension";

export default createStore(combineReducers({
    login: login_reducer
}), composeWithDevTools(applyMiddleware()));