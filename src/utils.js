import { BASE_URL } from "./myaxios";

export const toFullName = (first, last) => {
  if (first && last) return first + " " + last;
  if (first) return first;
  if (last) return last;
  return "";
};

export const checkImage = (image) => {
  if (image && !image.includes("http")) return BASE_URL + image;
  return image;
};

export const parseUserData = (data) => {
  const res = { ...data };
  res.name = toFullName(data.first_name, data.last_name);
  res.image = checkImage(data.image);
  return res;
};

export const reverseMap = (arr = [], fun) => {
  if (!arr) return;
  let newArr = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    newArr[arr.length - i - 1] = fun(arr[i], i, arr);
  }
  return newArr;
};
