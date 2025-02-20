const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  configureWebpack: {
    // It will be merged into the final Webpack config
    plugins: [
      new MiniCssExtractPlugin()
    ]
  }
}