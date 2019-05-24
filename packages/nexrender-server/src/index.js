const micro = require('micro')

const { router, withNamespace } = require('microrouter')
const { get, post, put, del }   = require('microrouter')
const { withSecret }            = require('./helpers/secret')

const ns = withNamespace('/api/v1')

const handler = secret => withSecret(secret, router(
    ns(post('/jobs',     require('./routes/jobs-create'))),
    ns(get('/jobs',      require('./routes/jobs-fetch'))),
    ns(get('/jobs/:uid', require('./routes/jobs-fetch'))),
    ns(put('/jobs/:uid', require('./routes/jobs-update'))),
    ns(del('/jobs/:uid', require('./routes/jobs-remove'))),

    ns(post('/projects',               require('./routes/projects-create'))),
    ns(get('/projects',                require('./routes/projects-fetch'))),
    ns(get('/projects/:status/:limit', require('./routes/projects-fetch'))),
    ns(get('/projects/:status', require('./routes/projects-fetch'))),
    ns(get('/project/:uid',            require('./routes/project-fetch'))),
    ns(put('/project/:uid',            require('./routes/project-update'))),
))

module.exports = {
    listen: (port = 3000, secret = '') => (
        micro(handler(secret)).listen(port)
    )
}
