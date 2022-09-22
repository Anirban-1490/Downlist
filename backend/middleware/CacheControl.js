const setCache = function (req, res, next) {
  //* middleware for cache controling

  //* you only wat to cache for GET requests but before caching made a validaiton request to the server
  if (req.method === "GET") {
    res.set("Cache-control", `no-cache`);
  } else {
    //* for the other requests set strict no caching parameters
    res.set("Cache-control", `no-store`);
  }

  next();
};

module.exports = setCache;
