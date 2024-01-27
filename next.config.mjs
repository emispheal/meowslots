/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.module.rules.push({
            test: /\.worker\.(js|mjs)$/,
            loader: 'worker-loader',
            // You can specify options here if necessary
          });
        }
    
        return config;
      },

};

export default nextConfig;
