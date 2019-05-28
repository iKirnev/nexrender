const assert               = require('assert')
const { send, json }       = require('micro')
const { create, validate } = require('@nexrender/types/job')
const { createJob } = require('../helpers/mongo')

module.exports = async (req, res) => {
    const data = await json(req)
    let job  = create(data); {
        job.state = 'queued';
    }

    try {
        assert(validate(job) == true);
        job = await createJob(job);
        console.log(`creating new job ${job._id}`)
    } catch (err) {
        return send(res, 400, err.stack)
    }

    send(res, 200, job)
}
