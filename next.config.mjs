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
      {
        protocol: "https",
        hostname: "files.stripe.com",
        pathname: "/links/**",
      },
      {
        protocol: "https",
        hostname: "exh3hjbxekjzz1bo.public.blob.vercel-storage.com",
        pathname: "**",
      },
    ],
  },
}

export default /*withAutoCert*/ nextConfig
