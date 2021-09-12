import { createContext, useReducer, useState } from "react";
import "./App.css";
import Conversion from "./component/Conversion";
import Login from "./component/Login";
import Side from "./component/Side";
import { myaxios } from "./myaxios";
import { initialData, reducer } from "./reducer";
import { parseUserData } from "./utils";

export const globalContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialData);
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);

  useState(async () => {
    const access = localStorage.getItem("access");

    if (access && access !== "undefined") {
      myaxios
        .get("/api/profile/")
        .then((res) => {
          const data = parseUserData(res.data);
          dispatch({ type: "setCurrentUser", payload: data });
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
