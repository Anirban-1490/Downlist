module.exports = {
    // Prefer loading of ES Modules over CommonJS
    experimental: { esmExternals: "loose" },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.myanimelist.net",
            },
        ],
    },
};
