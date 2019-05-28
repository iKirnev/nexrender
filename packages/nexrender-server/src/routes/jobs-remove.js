const { send }   = require('micro')
const { removeJob }  = require('../helpers/mongo')

module.exports = async (req, res) => {
    console.log(`removing job ${req.params._id}`)

    try {
        await removeJob(req.params._id);
    } catch (err) {
        return send(res, 400, err)
    }

    send(res, 200)
}
