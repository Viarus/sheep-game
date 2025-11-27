import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, createPropertySelectors } from '@ngxs/store';
import { AppAction } from './app.actions';
import { IField } from '../../models/field.model';

export interface AppStateModel {
  fields: IField[];
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    fields: [],
  },
})
@Injectable()
export class AppState {
  static getSlices = createPropertySelectors<AppStateModel>(AppState);

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
