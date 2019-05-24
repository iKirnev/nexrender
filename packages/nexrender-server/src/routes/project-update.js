const { send, json }  = require('micro')
const { updateProject } = require('../helpers/mongo')

module.exports = async (req, res) => {
  const data = await json(req)
  send(res, 200, await updateProject(req.params.uid, data));
}
