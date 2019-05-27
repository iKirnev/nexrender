const assert                  = require('assert')
const { send, json }          = require('micro')
const { validate }            = require('@nexrender/types/job')
const { updateJob, fetchJob } = require('../helpers/mongo')

module.exports = async (req, res) => {
    const data = await json(req)
    console.log(`updating job ${req.params.uid}`)

    try {
        assert(validate(data) == true);
        send(res, 200, await updateJob(req.params.uid, data));
    } catch (err) {
        return send(res, 400, err.stack)
    }
}
