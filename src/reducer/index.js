import { dummpyMessages, images } from "../component/data";

export const initialData = {
  currentUser: {
    id: 1,
    name: "Test User",
    image: images[0],
  },
  conversions: [
    {
      id: 2,
      name: "Jhon mario",
      image: images[2],
      status: "Online",
      isActive: false,
      text: "",
      messages: dummpyMessages,
    },
    {
      id: 3,
      name: "Naman Tamrakar",
      image: images[5],
      status: "Online",
      isActive: false,
      text: "",
      messages: dummpyMessages,
    },
  ],
};

export const reducer = (state = initialData, action) => {
  const { type, payload } = action;
  let conversionId, text;

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
      text = payload.text;
      return {
        ...state,
        conversions: state.conversions.map((i) =>
          i.id === conversionId ? { ...i, text } : i
        ),
      };

    case "logout":
      return {};

    default:
      return state;
  }
};
