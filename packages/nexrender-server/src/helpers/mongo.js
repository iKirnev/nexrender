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
const fetchJob = async (_id) => {
  const collection = db.collection('jobs');
  return await collection.findOne({_id: ObjectID(_id)});
}

const fetchJobs = async () => {
  const collection = db.collection('jobs');
  return await collection.find({'state': 'queued'}).limit(10).toArray();
}


const createJob = async entry => {
    const now = new Date().getTime();
    entry = Object.assign({}, entry, {
        updatedAt: now,
        createdAt: now
    })
    const collection = db.collection('jobs');
    await collection.insertOne(entry);
    if (entry.projectId) {
      updateProject(entry.projectId, {"render-status": `rend-${entry.state}`, job: entry});
    }
    return entry;
}

const updateJob = async (_id, entry) => {
    const now = new Date().getTime();
    const data = Object.assign({}, entry, {
        updatedAt: now
    })
    delete data._id;
    const collection = db.collection('jobs');
    const res = await collection.findOneAndUpdate({_id: ObjectID(_id), updatedAt: entry.updatedAt}, { $set: data }, {returnOriginal: false});
    if(!res.value) {
        throw new Error(`Job did not find or someone else updated that job. Your entry updatedAt is ${entry.updatedAt}`)
    }
    if (entry.projectId) {
      updateProject(entry.projectId, {"render-status": `rend-${entry.state}`, job: entry});
    }
    return res.value;
}

const removeJob = async _id => {
    const collection = db.collection('jobs');
    let job = await collection.findOne({_id: ObjectID(_id)}); if (!job) {
        return null;
    }

    await collection.deleteOne({_id: ObjectID(job._id)});
    return true;
}

const fetchProjects = async (status, limit, set_status, bot_name, caller) => {
  const collection = db.collection('projects');
  const docs = await collection
    .find({
      $and: [
        status && {'render-status': status} || {},
        bot_name && {$or: [{'bot': bot_name}, {'bot': ''}, {'bot': {$exists: false}} ]} || {}
      ]
    })
    .limit(parseInt(limit || 1000)).toArray();
  if (set_status) {
    docs.forEach((doc)=>{
      collection.updateOne({_id: ObjectID(doc._id)} , { $set: {'render-status': set_status, ...(bot_name && {'bot': bot_name})}});
      doc.bot = bot_name;
    });
  }
  return docs;
}

const fetchProject = async (_id) => {
  const collection = db.collection('projects');
  return await collection.findOne({_id: ObjectID(_id)});
}

const createProject = async (data) => {
  const collection = db.collection('projects');
  return await collection.insertMany(data);
}

const updateProject = async (_id, data) => {
  const collection = db.collection('projects');
  return await collection.updateOne({_id: ObjectID(_id)}, { $set: data });
}

module.exports = {
    createJob,
    fetchJob,
    fetchJobs,
    updateJob,
    removeJob,
    createProject,
    fetchProjects,
    fetchProject,
    updateProject,
    //remove,
}
