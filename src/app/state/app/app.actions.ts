import { ISheep } from '../../models/sheep.model';

export class AppAction {
  static readonly type = '[App] Add item';
  constructor(readonly payload: ISheep) {}
}
