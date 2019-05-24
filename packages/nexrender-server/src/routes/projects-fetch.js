const { send }  = require('micro')
const { fetchProjects } = require('../helpers/mongo')

module.exports = async (req, res) => {
  send(res, 200, await fetchProjects(req.params.status, req.params.limit, req.query.set_status, req.query.bot_name));
}
