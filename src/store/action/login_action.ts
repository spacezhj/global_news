import {SETSTORE} from "../constant";


//设置token
const setStore = (data: any) => {
    return {
        type: SETSTORE,
        data
    }
}


export {
    setStore

}