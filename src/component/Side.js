import React, { useContext, useEffect, useState } from "react";
import { globalContext } from "App";
import { parseUserData, toFullName } from "utils/parser";
import { debounce } from "utils/function";
import { socket } from "services/socket";
import { myaxios } from "services/http";
import Image from "core/Image";

export default function Side() {
  const { state, dispatch } = useContext(globalContext);
  const { currentUser, conversions } = state;

  // socket.on("close", () => tryReconnect(({ access }) => console.log(access)));

  useEffect(() => {
    const access = localStorage.getItem("access");
    socket.auth = { access };
    socket.connect();

    socket.on("error", (res) => {
      console.log(res);
    });
    socket.on("online", (res) => {
      console.log(res);
    });
    socket.on("offline", (res) => {
      console.log(res);
    });
    socket.on("message", (res) => {
      dispatch({ type: "setMessage", payload: res });
      console.log(res);
    });
    socket.on("seen", (res) => {
      console.log(res);
    });
    socket.on("new_room", (res) => {
      console.log(res);
    });
    socket.on("rooms", (res) => {
      console.log(res);
    });

    return () => {
      console.log("off...");
      socket.off("error");
      socket.off("online");
      socket.off("offline");
      socket.off("message");
      socket.off("seen");
      socket.off("new_room");
      socket.off("rooms");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    myaxios.get("/api/room/").then((res) => {
      const data = res.data?.map((el) => ({
        ...el,
        user: parseUserData(el.user),
      }));

      console.log(data);
      dispatch({
        type: "setConversions",
        payload: data,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [twosideActive, setTwosideActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchCoversions, setSearchCoversions] = useState([]);

  const fetchConversion = debounce((text) => {
    if (text) {
      myaxios
        .get("/api/signup/", {
          params: {
            username__icontains: text,
            search: text,
          },
        })
        .then((res) => {
          setSearchCoversions(res.data.results);
        })
        .catch((err) => console.log(err));
    }
  }, 100);

  const addNewConversion = (id, image, name) => {};

  return (
    <div className="col-sm-4 side">
      <div className="side-one">
        <div className="row heading">
          <div className="col-sm-3 col-xs-3 heading-avatar">
            <div
              className="heading-avatar-icon"
              title={`${currentUser?.name}-${currentUser?.id}`}
            >
              <Image src={currentUser?.image} />
            </div>
          </div>
          <div className="col-sm-2 col-xs-1  heading-dot  pull-right">
            <i
              className="fa fa-sign-out fa-2x pull-right"
              aria-hidden="true"
            ></i>
          </div>
          <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
            <i
              onClick={() => {
                setTwosideActive(!twosideActive);
              }}
              className="fa fa-comments fa-2x  pull-right"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="row searchBox">
          <div className="col-sm-12 searchBox-inner">
            <div className="form-group has-feedback">
              <input
                type="text"
                className="form-control"
                name="searchText"
                placeholder="Search"
              />
              <span className="glyphicon glyphicon-search form-control-feedback"></span>
            </div>
          </div>
        </div>

        <div className="row sideBar">
          {conversions?.map(({ id, user, isActive }) => {
            return (
              <div
                onClick={() => dispatch({ type: "setActiveChat", payload: id })}
                key={id}
                className={`row sideBar-body ${isActive && "active"}`}
              >
                <div className="col-sm-3 col-xs-3 sideBar-avatar">
                  <div className="avatar-icon">
                    <Image src={user?.image} />
                  </div>
                </div>
                <div className="col-sm-9 col-xs-9 sideBar-main">
                  <div className="row">
                    <div className="col-sm-8 col-xs-8 sideBar-name">
                      <span className="name-meta">{user?.name}</span>
                    </div>
                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                      <span className="time-meta pull-right">18:18</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="side-two"
        style={twosideActive ? { left: "0%" } : { left: "-100%" }}
      >
        <div className="row newMessage-heading">
          <div className="row newMessage-main">
            <div className="col-sm-2 col-xs-2 newMessage-back">
              <i
                onClick={() => {
                  setSearchText("");
                  setSearchCoversions([]);
                  setTwosideActive(!twosideActive);
                }}
                className="fa fa-arrow-left"
                aria-hidden="true"
              />
            </div>
            <div className="col-sm-10 col-xs-10 newMessage-title">New Chat</div>
          </div>
        </div>

        {/* Search bar */}
        <div className="row composeBox">
          <div className="col-sm-12 composeBox-inner">
            <div className="form-group has-feedback">
              <input
                onChange={(e) => {
                  setSearchText(e.target.value);
                  fetchConversion(e.target.value);
                }}
                type="text"
                value={searchText}
                className="form-control"
                name="searchText"
                placeholder="Search People"
              />
              <span className="glyphicon glyphicon-search form-control-feedback"></span>
            </div>
          </div>
        </div>

        <div className="row compose-sideBar">
          {searchCoversions.map(({ id, image, first_name, last_name }) => {
            return (
              <div
                onClick={() =>
                  addNewConversion(id, image, toFullName(first_name, last_name))
                }
                id={id}
                className="row sideBar-body"
              >
                <div className="col-sm-3 col-xs-3 sideBar-avatar">
                  <div className="avatar-icon">
                    <Image src={image} />
                  </div>
                </div>
                <div className="col-sm-9 col-xs-9 sideBar-main">
                  <div className="row">
                    <div className="col-sm-8 col-xs-8 sideBar-name">
                      <span className="name-meta">
                        {toFullName(first_name, last_name)}
                      </span>
                    </div>
                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                      <span className="time-meta pull-right">18:18</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {searchCoversions.length === 0 && (
            <div style={{ textAlign: "center", padding: "10px" }}>
              Start typing to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
