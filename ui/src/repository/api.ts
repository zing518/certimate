import PocketBase from "pocketbase";

const apiDomain = import.meta.env.VITE_API_DOMAIN;
console.log(apiDomain);

let pb: PocketBase;
export const getPb = () => {
  if (pb) return pb;
  pb = new PocketBase("/");
  return pb;
};
