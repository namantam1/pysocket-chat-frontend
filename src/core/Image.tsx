import React from "react";
import avatar from "assets/images/avatar.png";

interface IImageProps {
  src: string,
  alt: string
}

export default function Image({ src, alt = "image" }: IImageProps) {
  return (
    <img
      alt={alt}
      src={src}
      onError={(e: any) => {
        e.target.onerror = null;
        e.target.src = avatar;
      }}
    />
  );
}
