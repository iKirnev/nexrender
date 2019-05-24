const { send, json }  = require('micro')
const { createProject } = require('../helpers/mongo')

module.exports = async (req, res) => {
  const data = await json(req)
  send(res, 200, await createProject(data));
}
