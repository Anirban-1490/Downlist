export const ironOptions = {
    cookieName: process.env.COOKIE_NAME + "",
    password: process.env.COOKIE_PASSWORD + "",
    cookieOptions: {
        secure: process.env.NODE_ENV == "production",
    },
};
