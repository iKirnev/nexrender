const { send }      = require('micro')
const { fetchJob, fetchJobs }  = require('../helpers/mongo')

module.exports = async (req, res) => {
    if (req.params.uid) {
        //console.log(`fetching job ${req.params.uid}`)
        send(res, 200, await fetchJob(req.params.uid))
    } else {
        //console.log(`fetching list of all jobs`)
        send(res, 200, await fetchJobs())
    }
}
