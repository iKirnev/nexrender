require('dotenv/config');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
let db;

// Use connect method to connect to the server
MongoClient.connect(process.env.MONGO, { useNewUrlParser: true }, function(err, client) {
  if(err) throw err;

  db = client.db(process.env.DB);
});

/* public api */
const fetchProjects = async (status, limit, set_status, bot_name, caller) => {
  const collection = db.collection('projects');
  const docs = await collection.find(status && {'render-status': status} || {}).limit(parseInt(limit || 1000)).toArray();
  if (set_status) {
    docs.forEach((doc)=>{
      collection.updateOne({_id: ObjectID(doc._id)} , { $set: {'render-status': set_status, ...(bot_name && {'bot-name': bot_name})}});
    });
  }
  return docs;
}

const fetchProject = async (uid) => {
  const collection = db.collection('projects');
  return await collection.findOne({_id: ObjectID(uid)});
}

const createProject = async (data) => {
  const collection = db.collection('projects');
  return await collection.insertMany(data);
}

const updateProject = async (uid, data) => {
  const collection = db.collection('projects');
  return await collection.updateOne({_id: ObjectID(uid)}, { $set: data });
}

module.exports = {
    createProject,
    fetchProjects,
    fetchProject,
    updateProject,
    //remove,
}
