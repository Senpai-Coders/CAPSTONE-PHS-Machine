/** @type {import('next').NextConfig} */

module.exports = {
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
    exportPathMap: async function () {
      const paths = {
        "/": { page: "/" },
      };
      return paths; //<--this was missing previously
    },
    env: {
      MONGODB_URI:"mongodb+srv://Jervx:helloworld@capstone.nv1cu.mongodb.net/PHS_MACHINE?retryWrites=true&w=majority",
      JWT_SECRET_KEY:"ErenJaeger",
    },
  };