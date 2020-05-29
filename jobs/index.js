const cron = require('cron');

const canLog = (options) => {
  const { logger, environment } = options;
  return logger && environment;
};

const logInfo = (options, info) => {
  if (canLog(options)) {
    options.logger.info(info);
  }
};

const logError = (options, error) => {
  if (canLog(options)) {
    options.logger.error(error);
  }
};

const runJob = async (job, options) => {
  logInfo(options, `Job ${job.name} started.`);

  try {
    await job.onTick({
      services: options.services,
    });
  } catch (err) {
    logError(err);
  } finally {
    logInfo(options, `Job ${job.name} finished.`);
  }
};

const filterEnvironments = (options) => ([, { environments }]) => !environments
|| environments.includes(options.environment)
|| (environments.length === 1 && environments[0] === '*');

const createCronJob = (options) => ([, job]) => ({
  name: job.name,
  cronJob: new cron.CronJob({
    cronTime: job.cronTime,
    onTick: () => runJob(job, options),
    timezone: job.timezone || 'America/Sao_Paulo',
    runOnInit: job.runOnInit || false,
  }),
});

const createJobInstances = (jobs) => jobs.reduce((acc, job) => {
  acc[job.name] = job.cronJob;
  return acc;
}, {});

module.exports.init = async (options) => {
  const jobs = Object.entries(options.jobs || {})
    .filter(filterEnvironments(options))
    .map(createCronJob(options));

  jobs.forEach((job) => job.cronJob.start());

  return createJobInstances(jobs);
};
