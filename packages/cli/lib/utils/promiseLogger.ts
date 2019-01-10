import * as createLogger from 'progress-estimator';

export const promiseLogger = async (...args: any[]) => {
  return (createLogger as any)({})(...args);
};
