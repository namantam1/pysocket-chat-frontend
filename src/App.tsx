import React, { createContext, useEffect, useReducer, useState } from "react";
import "assets/css/style.css";
import Conversion from "component/Conversion";
import Login from "component/Login";
import Side from "component/Side";
import { myaxios } from "services/http";
import {
  ActionType,
  IInitialData,
  initialData,
  IReducer,
  reducer,
} from "reducer";
import { parseUserData } from "utils/parser";

export const globalContext = createContext<any>(null);

function App() {
  const [state, dispatch] = useReducer<React.Reducer<IInitialData, IReducer>>(
    reducer,
    initialData
  );
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (access && access !== "undefined") {
      myaxios
        .get("/api/profile/")
        .then((res) => {
          const data = parseUserData(res.data);
          dispatch({ type: ActionType.setCurrentUser, payload: data });
          setLoading(false);
          setLogin(true);
        })
        .catch((err) => console.log(err));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className={loading ? "loading" : ""}>
      {login ? (
        <globalContext.Provider value={{ state, dispatch }}>
          <div className="container app">
            <div className="row app-one">
              <Side />
              <Conversion />
            </div>
          </div>
        </globalContext.Provider>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
