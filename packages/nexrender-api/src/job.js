const EventEmitter = require('events');

const NEXRENDER_JOB_POLLING = process.env.NEXRENDER_JOB_POLLING || 10 * 1000;

const withEventEmitter = (fetch, job, polling = NEXRENDER_JOB_POLLING) => {
    const emitter  = new EventEmitter();
    const interval = setInterval(async () => {
        try {
            const updatedJob = await fetch(`/jobs/${job._id}`)

            if (job.state != updatedJob.state) {
                job.state = updatedJob.state;
                emitter.emit(job.state, updatedJob, fetch);
            }

            if (job.state == 'finished' || job.state == 'error') {
                clearInterval(interval);
            }
        } catch (err) {
            clearInterval(interval);
            emitter.emit('error', err);
        }

    }, polling);

    /* trigger first callback */
    setImmediate(() => emitter.emit('created', job))

    return emitter;
}

module.exports = (fetch, polling) => ({
    listJobs: async () => await fetch(`/jobs`),

    addJob: async data =>
        withEventEmitter(fetch, await fetch(`/jobs`, {
            'method': 'post',
            'content-type': 'application/json',
            'body': JSON.stringify(data),
        }), polling),

    updateJob: async (_id, data) =>
        await fetch(`/jobs/${_id}`, {
            'method': 'put',
            'content-type': 'application/json',
            'body': JSON.stringify(data),
        }),

    removejob: async _id =>
        await fetch(`/jobs/${_id}`, {
            'method': 'delete'
        }),
})
