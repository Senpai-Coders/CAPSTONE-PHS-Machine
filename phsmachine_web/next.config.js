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
      //MONGODB_URI:"mongodb://192.168.1.5:27017/PHS_MACHINE",
      MONGODB_URI:"mongodb+srv://Jervx:helloworld@capstone.nv1cu.mongodb.net/?retryWrites=true&w=majority",
      JWT_SCRT:"ErenJaeger",
      PI_IP:"192.168.1.7",
      EXPIRATION: 86400 //Seconds
    },
  };