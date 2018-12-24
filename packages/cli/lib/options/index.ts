import * as _ from 'lodash';

import { IArgs } from '../Service';
import DefaultOptions from './default';

// tslint:disable-next-line:variable-name
export const getOptions = (_options: Partial<DefaultOptions>, args: IArgs): DefaultOptions => {
  const projectOptions = Object.assign({}, _options);
  if (!projectOptions.port && process.env.PORT) {
    projectOptions.port = process.env.PORT;
  }
  if (!projectOptions.host && process.env.HOST) {
    projectOptions.host = process.env.HOST;
  }
  if (!projectOptions.ssr && process.env.SSR) {
    projectOptions.ssr = Boolean(process.env.SSR);
  }
  if (args.spa) {
    projectOptions.ssr = !args.spa;
  }
  if (args.analyze) {
    projectOptions.analyze = args.analyze;
  }
  const options = _.defaultsDeep(projectOptions, new DefaultOptions()) as DefaultOptions;
  if (!projectOptions.ssr) {
    options.devPort = options.port;
  }
  return options;
};
