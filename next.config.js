/** @type {import('next').NextConfig} */
const nextConfig = {
  
    compiler: {
      styledComponents: true,
    },
    experimental: {

      optimizePackageImports: [
          '@mantine/core',
          '@mantine/hooks'
      ],
}

  }
  
  module.exports = nextConfig