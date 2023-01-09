import {SETSTORE} from "../constant";

const b = {
    token: localStorage.getItem("token"),
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}")
}

function todoApp(state = b, action: any) {
    console.log("state ==>", state)
    let {type, data} = action;
    switch (type) {
        case SETSTORE: {
            console.log("组合后的数据--->", {
                ...state,
                ...data
            })
            return {
                ...state,
                ...data
            }
        }

        default:
            return state
    }
}

export default todoApp