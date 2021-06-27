<<<<<<< HEAD
// module.exports = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       // Unset client-side javascript that only works server-side
//       // https://github.com/vercel/next.js/issues/7755#issuecomment-508633125
//       config.node = { fs: "empty", module: "empty" };
//     }
//
//     return config;
//   },
//   images: {
//     domains: ["i.scdn.co"],
//   },
// };
=======
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Unset client-side javascript that only works server-side
      // https://github.com/vercel/next.js/issues/7755#issuecomment-508633125
      config.node = { fs: "empty", module: "empty" };
    }

    return config;
  },
  images: {
    domains: ["i.scdn.co"],
  },
};
>>>>>>> c8b62f7f3720554f8f8c230f487f3df91eea83af
