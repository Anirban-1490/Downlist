import { getRandomID } from "Feature/RandomID";
import { withIronSessionApiRoute } from "iron-session/next";

import { authorizeDomain } from "Feature/Authorize/AuthorizeDomain";

async function loginHandler(req, res) {
    const { token } = req.body;
    req.session.userToken = token;

    const uniqueID = getRandomID();
    try {
        const data = await authorizeDomain(token);

        req.session.user = data.user;
        await req.session.save();
        res.status(200).json({
            message: "Successfully Authorized",
        });
    } catch (error) {
        res.status(401).json({ message: error.response.data.message });
    }
}

export default withIronSessionApiRoute(loginHandler, {
    cookieName: process.env.COOKIE_NAME + "",
    password: process.env.COOKIE_PASSWORD + "",
    cookieOptions: {
        secure: process.env.NODE_ENV == "production",
    },
});
