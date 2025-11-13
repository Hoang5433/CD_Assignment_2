import Cookies from "js-cookie";

export function setJWTtoCookie(token) {
  Cookies.set("access_token", token, {
    expires: 7, 
    secure: true,
    sameSite: "strict",
  });
}

export function getJWTfromCookie() {
  return Cookies.get("access_token");
}

export function removeJWTfromCookie() {
  Cookies.remove("access_token");
}
