/** @type {import('next').NextConfig} */
//import autoCert from "anchor-pki/auto-cert/integrations/next"

/*const withAutoCert = autoCert({
  enabledEnv: "development",
})*/

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        pathname: "**",
      },
    ],
  },
}

export default /*withAutoCert*/ nextConfig
