const withCss = require('@zeit/next-css');
if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {
  }
}

module.exports = withCss({
  env: {
    customKey: 'Value'
  },
  // 在客户端渲染拿到的serverRuntimeConfig是个空对象
  serverRuntimeConfig: {
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET
  },
  // 在服务端渲染和客户端渲染均能够获取的配置
  publicRuntimeConfig: {
    staticFolder: '/static'
  }
});
