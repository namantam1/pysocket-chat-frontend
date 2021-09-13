import { BASE_URL } from "services/http";

export const toFullName = (first?: string, last?: string) => {
  if (first && last) return first + " " + last;
  if (first) return first;
  if (last) return last;
  return "";
};

export const checkImage = (image?: string) => {
  if (image && !image.includes("http")) return BASE_URL + image;
  return image;
};

export const parseUserData = (data: any) => {
  const res = { ...data };
  res.name = toFullName(data.first_name, data.last_name);
  res.image = checkImage(data.image);
  return res;
};
