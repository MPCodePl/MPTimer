import { GuidUtils } from 'utils';

export class RepositoryModel {
  public id = GuidUtils.generateGuid();

  constructor(public name: string, public path: string, public date: Date) {}
}
