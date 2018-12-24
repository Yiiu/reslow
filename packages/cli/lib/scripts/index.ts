
import build from './build';
import create from './create';
import start from './start';

import Service, { Command, IArgs } from '../Service';

export default class Script {
  public service: Service;
  constructor(service: Service) {
    this.service = service;
  }

  public run = (command: Command, args: IArgs) => {
    this[command](args);
  }

  public start = (args: IArgs) => {
    start(this.service, args);
  }

  public build = (args: IArgs) => {
    build(this.service, args);
  }

  public create = (projectName: string, args: IArgs) => {
    create(projectName, args);
  }
}
