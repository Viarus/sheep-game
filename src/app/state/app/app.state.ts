import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AppAction } from './app.actions';
import { ISheep } from '../../models/sheep.model';

export interface AppStateModel {
  fields: ISheep[];
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    fields: [],
  },
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
    stateModel.fields = [...stateModel.fields, payload];
    ctx.setState(stateModel);
  }
}
