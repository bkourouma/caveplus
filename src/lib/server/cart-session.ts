import type { GetServerSidePropsContext } from "next";
import type { NextApiRequest, NextApiResponse } from "next";

export const CART_COOKIE_NAME = "caveplus-cart";

function parseCookieHeader(cookieHeader?: string) {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) {
      return acc;
    }

    acc[rawKey] = decodeURIComponent(rawValue.join("="));
    return acc;
  }, {});
}

export function createCartId() {
  return `cart_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function getCartIdFromCookieHeader(cookieHeader?: string) {
  const cookies = parseCookieHeader(cookieHeader);
  return cookies[CART_COOKIE_NAME] ?? null;
}

export function getCartIdFromRequest(req: NextApiRequest | GetServerSidePropsContext["req"]) {
  return getCartIdFromCookieHeader(req.headers.cookie);
}

export function setCartCookie(res: NextApiResponse | GetServerSidePropsContext["res"], cartId: string) {
  res.setHeader("Set-Cookie", `${CART_COOKIE_NAME}=${encodeURIComponent(cartId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
}

export function clearCartCookie(res: NextApiResponse | GetServerSidePropsContext["res"]) {
  res.setHeader("Set-Cookie", `${CART_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
