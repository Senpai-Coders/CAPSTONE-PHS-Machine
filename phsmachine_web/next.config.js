/** @type {import('next').NextConfig} */

module.exports = {
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
    exportPathMap: async function () {
      const paths = {
        "/": { page: "/" },
        '/auth/signin': { page: '/auth/signin' },
        '/anlysis': { page: '/analysis' },
        '/configuration': { page: '/configuration' },
      };
      return paths; //<--this was missing previously
    },
    env: {
      MONGODB_URI:"mongodb://192.168.1.6:27017/PHS_MACHINE",
      //MONGODB_URI:"mongodb://Jervx:helloworld@capstone.nv1cu.mongodb.net/PHS_MACHINE?retryWrites=true&w=majority",
      JWT_SCRT:"ErenJaeger",
      EXPIRATION: 86400 //Seconds
    },
  };