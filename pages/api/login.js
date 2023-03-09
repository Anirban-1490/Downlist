import { getRandomID } from "Feature/RandomID";
import { withIronSessionApiRoute } from "iron-session/next";

import { authorizeDomain } from "Feature/Authorize/AuthorizeDomain";
import { ironOptions } from "lib/IronOption";

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

export default withIronSessionApiRoute(loginHandler, ironOptions);
