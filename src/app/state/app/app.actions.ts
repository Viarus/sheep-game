export class AppAction {
  static readonly type = '[App] Add item';
  constructor(readonly payload: string) { }
}
