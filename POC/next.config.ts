import type { NextConfig } from "next"
import { version } from "./package.json"
import { codeInspectorPlugin } from "code-inspector-plugin"

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg")
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/ // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                // https://svgo.dev/docs/preset-default/
                // Since svgr uses svgo optimization by default and svgo has removeViewBox enabled by default, this results in the inability to perform proportional scaling. Therefore, certain optimizations need to be manually enabled
                plugins: [
                  "removeDoctype",
                  "removeXMLProcInst",
                  "removeComments",
                  "removeUselessDefs",
                  "removeHiddenElems",
                  "removeEmptyText",
                  "removeEmptyText",
                  "removeEmptyContainers",
                  "removeUnusedNS",
                  "minifyStyles",
                  "sortAttrs",
                  "sortDefsChildren"
                ]
              }
            }
          }
        ]
      }
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    // add code inspector plugin, If you want to use it, turn off the --turbopack mode
    config.plugins.push(
      codeInspectorPlugin({ bundler: "webpack", editor: "cursor" })
    )
    return config
  },
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: [
            {
              loader: "@svgr/webpack",
              options: {
                svgoConfig: {
                  plugins: [
                    "removeDoctype",
                    "removeXMLProcInst",
                    "removeComments",
                    "removeUselessDefs",
                    "removeHiddenElems",
                    "removeEmptyText",
                    "removeEmptyText",
                    "removeEmptyContainers",
                    "removeUnusedNS",
                    "minifyStyles",
                    "sortAttrs",
                    "sortDefsChildren"
                  ]
                }
              }
            }
          ],
          as: "*.tsx"
        }
      }
    }
  },
  env: {
    BUILD_ENV: process.env.BUILD_ENV,
    VITE_BASE_API: process.env.NEXT_PUBLIC_BASE_API,
    APP_VERSION: version,
    APP_BUILD_TIME: new Date().toISOString()
  }
}

export default nextConfig
