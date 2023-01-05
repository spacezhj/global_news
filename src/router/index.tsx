import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import UserList from "../views/sandbox/user-manage/UserList";
import RightList from "../views/sandbox/right-manage/RightList";
import RoleList from "../views/sandbox/right-manage/RoleList";
import Error from "../views/sandbox/nomermission/Error";
import Home from "../views/sandbox/home/Home";

let b = false;

// eslint-disable-next-line import/no-anonymous-default-export
export const yi = [
    {
        path: "/",
        element: b ? <Login/> : <NewsSandBox/>,
        children: [
            {
                path: "home",
                element: <Home/>,
            },
            {
                path: "user-manage",
                children: [
                    {
                        path: "list",
                        element: <UserList/>,
                    }
                ]
            },
            {
                path: "right-manage",
                // element: <RightList/>,
                children: [
                    {
                        path: "right/list",
                        element: <RightList/>,
                    },
                    {
                        path: "role/list",
                        element: <RoleList/>,
                    }
                ]
            }
        ]
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "*",
        element: <Error/>,
    },


]