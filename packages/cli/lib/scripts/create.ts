import * as _ from 'lodash';

import { IArgs } from '../Service';
import Create from './utils/Create';

export default async (projectName: string, args: IArgs) => {
  const defaultConfig = {
    spa: false,
    npm: false
  };
  const create = new Create(projectName, _.defaultsDeep(args, defaultConfig));
  create.create();
};
