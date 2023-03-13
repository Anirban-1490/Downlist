import { authorizeDomain } from "Feature/Authorize/AuthorizeDomain";
import { getIronSession } from "iron-session/edge";
import { ironOptions } from "lib/IronOption";
import { NextResponse } from "next/server";

export const middleware = async (req) => {
    const response = NextResponse.next();

    const session = await getIronSession(req, response, ironOptions);

    if (!session.userToken && req.nextUrl.pathname !== "/userauth") {
        return NextResponse.redirect(new URL("/userauth", req.url));
    } else if (req.nextUrl.pathname === "/userauth" && session.userToken) {
        //* logged in users can't access signup page again

        return NextResponse.redirect(new URL("/", req.url));
    } else if (session.userToken && req.nextUrl.pathname !== "/userauth") {
        //* usage of a buffer instead of string as long string value
        //* was taking much space
        const buffer = Buffer.from(session.userToken);

        try {
            const data = await authorizeDomain(buffer.toString("utf-8"));
            session.user = data.user;
            await session.save();
        } catch (error) {
            await session.destroy();
            return NextResponse.redirect(new URL("/userauth", req.url));
        }
    }
    return response;
};

export const config = {
    matcher: [
        "/u/:userID/profile/view",
        "/u/:userID/list/anime",
        "/u/:userID/list/character",
        "/userauth",
    ],
};
