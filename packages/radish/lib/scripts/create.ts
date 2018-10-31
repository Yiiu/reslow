import Create from './utils/Create';

export default async (projectName: string) => {
  const create = new Create(projectName);
  create.create();
};
