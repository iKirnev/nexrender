const os      = require('os')
const fs      = require('fs')
const path    = require('path')
const mkdirp  = require('mkdirp')
const assert  = require('assert')

const { create, validate } = require('@nexrender/types/job')

/**
 * This task creates working directory for current job
 */
module.exports = (job, settings) => {
    /* fill default job fields */
    job = create(job)

    settings.logger.log(`[${job._id}] setting up job...`);

    try {
        assert(validate(job) == true)
    } catch (err) {
        return Promise.reject('Error veryifing job: ' + err)
    }

    // set default job result file name
    if (job.template.outputExt) {
        job.resultname = 'result.' + job.template.outputExt;
    } else {
        job.resultname = 'result.' + (os.platform() === 'darwin' ? 'mov' : 'avi');
    }

    // NOTE: for still (jpg) image sequence frame filename will be changed to result_[#####].jpg
    if (job.template.outputExt && ['jpeg', 'jpg', 'png'].indexOf(job.template.outputExt) !== -1) {
        job.resultname = 'result_[#####].' + job.template.outputExt;
        job.template.imageSequence = true;
    }

    if (job.actions.postrender.length < 1 && !settings.skipCleanup) {
        settings.logger.log(`[${job._id}] -- W A R N I N G: --

You haven't provided any post-render actions!
After render is finished all the files inside temporary folder (INCLUDING your target video) will be removed.

To prevent this from happening, please add an action to "job.actions.postrender".
For more info checkout: https://github.com/inlife/nexrender#Actions

P.S. to prevent nexrender from removing temp file data, you also can please provide an argument:
    --skip-cleanup (or skipCleanup: true if using programmatically)\n`);
    }

    // setup paths
    job.workpath = path.join(settings.workpath, job._id);
    job.output   = job.output || path.join(job.workpath, job.resultname);
    mkdirp.sync(job.workpath);

    settings.logger.log(`[${job._id}] working directory is: ${job.workpath}`);

    return Promise.resolve(job)
};
