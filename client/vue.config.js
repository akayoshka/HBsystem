// vue.config.js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  // Настройка заголовков и метатегов
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = process.env.VUE_APP_TITLE || 'HealthBooker';
      args[0].meta = {
        description: process.env.VUE_APP_DESCRIPTION || 'Book appointments with doctors online'
      };
      return args;
    });
  }
});