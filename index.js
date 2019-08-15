const Koa = require('koa')
const Sequelize = require('sequelize')
const config = require('./src/config')
const cors = require('koa2-cors');
const koaBody = require('koa-body')
const Router = require('koa-router');
const compress = require('koa-compress');
const router = new Router();
const app = new Koa()
const options = { threshold: 2048 }
app.use(compress(options))

app.use(cors())
app.use(koaBody({ multipart: true }));
app.use(router.routes()).use(router.allowedMethods());

var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 30000
        }
    }
)

router.post('/obs', async (ctx, next) => {
    try {
        // console.log("sql语句：", ctx.request.body.sql);
        let result = await sequelize.query(ctx.request.body.sql);
        ctx.response.type = 'json'
        ctx.response.body = { code: 0, data: result[0] }
    } catch (error) {
        console.error(error)
        ctx.response.type = 'json'
        ctx.response.body = { code: -1, data: 'operate fault' }
    }
})

router.get('/', async (ctx, next) => {
    try {
        ctx.response.type = 'json'
        ctx.response.body = { code: 0, data: '😄' }
    } catch (error) {
        ctx.response.type = 'json'
        ctx.response.body = { code: -1, data: 'operate fault' }
    }
})

app.listen(3005)
console.log('app started at port 3005...')