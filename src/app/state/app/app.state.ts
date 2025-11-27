import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AppAction } from './app.actions';

export interface AppStateModel {
  items: string[];
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    items: []
  }
})
@Injectable()
export class AppState {

  @Selector()
  static getState(state: AppStateModel) {
    return state;
  }

  @Action(AppAction)
  add(ctx: StateContext<AppStateModel>, { payload }: AppAction) {
    const stateModel = ctx.getState();
    stateModel.items = [...stateModel.items, payload];
    ctx.setState(stateModel);
  }
}
