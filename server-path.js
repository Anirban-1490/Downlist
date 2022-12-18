export const path = {
    domain:
        process.env.NODE_ENV === "development"
            ? "http://localhost:5000/"
            : "https://server-downlist.onrender.com/",
};
