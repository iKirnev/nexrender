const assert               = require('assert')
const { send, json }       = require('micro')
const { create, validate } = require('@nexrender/types/job')
const { createJob } = require('../helpers/mongo')

module.exports = async (req, res) => {
    const data = await json(req)
    let job  = create(data); {
        job.state = 'queued';
    }

    console.log(`creating new job ${job.uid}`)

    try {
        assert(validate(job) == true);
        job = await createJob(job);
    } catch (err) {
        return send(res, 400, err.stack)
    }

    send(res, 200, job)
}
