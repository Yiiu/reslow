import Create from './utils/Create';

export default async (projectName: string, data: any) => {
  const create = new Create(projectName);
  create.create();
};
