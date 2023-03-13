import { getRandomID } from "Feature/RandomID";
import { withIronSessionApiRoute } from "iron-session/next";

import { authorizeDomain } from "Feature/Authorize/AuthorizeDomain";
import { ironOptions } from "lib/IronOption";

async function logoutHandler(req, res) {
    req.session.destroy();
    res.status(200).json({ message: "success" });
}

export default withIronSessionApiRoute(logoutHandler, ironOptions);
