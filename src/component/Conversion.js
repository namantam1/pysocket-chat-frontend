import React, { useContext, useEffect, useRef } from "react";
import { globalContext } from "../App";
import { v4 as uuid4 } from "uuid";
import { myaxios } from "../myaxios";
import { socket } from "../socket";
import { reverseMap } from "../utils";
import Image from "./Image";

export default function Conversion() {
  const { state, dispatch } = useContext(globalContext);
  const { conversions, currentUser } = state;
  const conversion = conversions.find((i) => i.isActive);
  const userId = currentUser?.id;
  const messageEnd = useRef(null);

  // Component Did Update
  useEffect(() => {
    if (conversion && !conversion?.messages) {
      // fetch room messages
      const id = conversion.id;
      myaxios.get(`/api/${id}/message`).then((res) => {
        console.log(res.data, id);
        dispatch({
          type: "setMessages",
          payload: {
            id,
            messages: res.data,
          },
        });
      });

      // scroll
      messageEnd.current?.scrollIntoView({ behavior: "auto" });
    } else {
      // scroll on update (smooth)
      messageEnd.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversion]);

  const setText = (text = "") => {
    dispatch({
      type: "setText",
      payload: {
        text: text,
        id: conversion?.id,
      },
    });
  };

  const handleSubmit = (e) => {
    if (conversion?.text) {
      const data = {
        user: userId,
        id: uuid4(),
        text: conversion?.text,
        image: conversion?.image,
        room: conversion?.id,
        timestamp: new Date().toISOString(),
        seen: false,
      };

      console.log("before dispatch");
      dispatch({
        type: "setMessage",
        payload: data,
      });
      console.log("after dispatch");

      socket.send(data);

      setText("");
    }

    e.preventDefault();
  };

  return (
    <div className="col-sm-8 conversation">
      <div className="row heading">
        <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar">
          <div className="heading-avatar-icon">
            <Image src={conversion?.user?.image} />
          </div>
        </div>
        <div className="col-sm-8 col-xs-7 heading-name">
          <p className="heading-name-meta">{conversion?.name}</p>
          <span className="heading-online">{conversion?.status}</span>
        </div>
        <div className="col-sm-1 col-xs-1  heading-dot pull-right">
          <i
            className="fa fa-ellipsis-v fa-2x  pull-right"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="row message">
        <div className="row message-previous">
          <div className="col-sm-12 previous">
            <a href="#link" name={20}>
              Show Previous Message!
            </a>
          </div>
        </div>

        {reverseMap(
          conversion?.messages,
          ({ id, text, image, seen, user, timestamp }) => {
            const type = user === userId ? "sender" : "receiver";

            return (
              <div className="row message-body" key={id} data-id={id}>
                <div className={`col-sm-12 message-main-${type}`}>
                  <div className={type}>
                    <div className="message-text">{text}</div>
                    <span className="message-time pull-right">{timestamp}</span>
                  </div>
                </div>
              </div>
            );
          }
        )}
        <div style={{ height: "10px" }} ref={messageEnd}></div>
      </div>

      <div className="row reply">
        <div className="col-sm-1 col-xs-1 reply-emojis">
          <i className="fa fa-smile-o fa-2x" />
        </div>
        <div className="col-sm-9 col-xs-9 reply-main">
          <textarea
            value={conversion?.text || ""}
            onChange={(val) => setText(val.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
            className="form-control"
            rows={1}
          />
        </div>
        <div className="col-sm-1 col-xs-1 reply-recording">
          <i className="fa fa-microphone fa-2x" aria-hidden="true" />
        </div>
        <div className="col-sm-1 col-xs-1 reply-send">
          <i className="fa fa-send fa-2x" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
