import React from "react";

export type ID = string;

export interface IUser {
  id: ID;
  name: string;
  image: string;
}

export interface IMessage {
  id: ID;
  room: ID;
  user: number;
  image?: string;
  text?: string;
  seen: boolean;
  timestamp: string;
}

export interface IConversion {
  id: ID;
  name: string;
  image?: string;
  status: string;
  isActive: boolean;
  messages: IMessage[];
}

export interface IInitialData {
  currentUser?: IUser;
  conversions: IConversion[];
}

export enum ActionType {
  setCurrentUser = "setCurrentUser",
  setConversions = "setConversions",
  setActiveChat = "setActiveChat",
  setMessage = "setMessage",
  setMessages = "setMessages",
  setText = "setText",
  logout = "logout",
}

export interface IReducer {
  type: ActionType;
  payload: any;
}

export const initialData: IInitialData = {
  conversions: [],
};

export const reducer: React.Reducer<IInitialData, IReducer> = (
  state = initialData,
  action
) => {
  const { type, payload } = action;
  let conversionId: ID;

  switch (type) {
    case "setCurrentUser":
      return { ...state, currentUser: payload };

    case "setConversions":
      return { ...state, conversions: payload };

    case "setActiveChat":
      return {
        ...state,
        conversions: state.conversions.map((i) =>
          i.id === payload
            ? { ...i, isActive: true }
            : { ...i, isActive: false }
        ),
      };

    case "setMessage":
      conversionId = payload.room;
      // console.log(payload.message, conversionId);
      return {
        ...state,
        conversions: state.conversions.map((i) => {
          if (i.id === conversionId) {
            if (i.messages) {
              const new_arr = i.messages.slice();
              const index = i.messages.findIndex((el) => el.id === payload.id);

              if (index !== -1) {
                new_arr[index] = payload;
              } else {
                new_arr.unshift(payload);
              }

              return { ...i, messages: new_arr };
            }
            return { ...i, messages: [payload] };
          }

          return i;
        }),
      };

    case "setMessages":
      conversionId = payload.id;
      const messages = payload.messages;
      return {
        ...state,
        conversions: state.conversions.map((i) =>
          i.id === conversionId ? { ...i, messages } : i
        ),
      };

    case "setText":
      conversionId = payload.id;
      let text = payload.text;
      return {
        ...state,
        conversions: state.conversions.map((i) =>
          i.id === conversionId ? { ...i, text } : i
        ),
      };

    case "logout":
      return state;

    default:
      return state;
  }
};
