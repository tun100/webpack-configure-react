const Koa = require('koa')
const app = new Koa();

app.use(ctx=>{
    ctx.body = 'koa is amazing!'
})

app.listen(3000);