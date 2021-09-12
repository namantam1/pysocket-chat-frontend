import React from "react";
import avatar from "./avatar.png";

export default function Image({ src, alt = "image" }) {
  return (
    <img
      alt={alt}
      src={src}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = avatar;
      }}
    />
  );
}
