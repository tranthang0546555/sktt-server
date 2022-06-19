const apiRouter = require('./api')

const routes = (app) => {
    app.use('/api/v1', apiRouter)
}

module.exports = routes