import { IField } from '../../models/field.model';

export class AppAction {
  static readonly type = '[App] Add item';
  constructor(readonly payload: IField) {}
}
