const { send }   = require('micro')
const { removeJob }  = require('../helpers/mongo')

module.exports = async (req, res) => {
    console.log(`removing job ${req.params.uid}`)

    try {
        await removeJob(req.params.uid);
    } catch (err) {
        return send(res, 400, err)
    }

    send(res, 200)
}
