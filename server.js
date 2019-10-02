const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
// 创建一个app，并指定为开发状态
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev
});
const handle = app.getRequestHandler();
// 等pages下面的所有页面编译完成之后启动服务，响应请求
app.prepare().then(() => {
  // 实例化KoaServer
  const server = new Koa();
  const router = new Router();
  server.use(router.routes());
  router.get('/a/:id', async ctx => {
    const id = ctx.params.id;
    await app.render(ctx.req, ctx.res, '/a', {id});
    ctx.respond = false
  });
  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false
  });
  // 使用中间件
  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next()
  });
  // 监听端口
  server.listen(3000, () => {
    console.log('koa server listening on 3000')
  });
});
