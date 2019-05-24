const { send }  = require('micro')
const { fetchProject } = require('../helpers/mongo')

module.exports = async (req, res) => {
  send(res, 200, await fetchProject(req.params.uid));
}
