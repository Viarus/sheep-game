import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, createPropertySelectors } from '@ngxs/store';
import { SubmitNewFieldForm } from './app.actions';
import { Field, IField } from '../../models/field.model';
import { append, patch } from '@ngxs/store/operators';
import { ResetForm } from '@ngxs/form-plugin';

export const newFieldFormPath = 'app.newFieldForm';
export const newSheepFormPath = 'app.newSheepForm';

export type newFieldFormModel = {
  name: string | null | undefined;
};

export type newSheepFormModel = {
  name: string | null | undefined;
  gender: string | null | undefined;
  isBranded: boolean | null | undefined;
  field: string | null | undefined;
};

export interface AppStateModel {
  fields: IField[];
  newFieldForm: {
    model?: newFieldFormModel;
    dirty: boolean;
    status: string;
    errors: object;
  };
  newSheepForm: {
    model?: newSheepFormModel;
    dirty: boolean;
    status: string;
    errors: object;
  };
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    fields: [],
    newFieldForm: {
      model: {
        name: '',
      },
      dirty: false,
      status: '',
      errors: {},
    },
    newSheepForm: {
      model: {
        name: '',
        gender: '',
        isBranded: false,
        field: '',
      },
      dirty: false,
      status: '',
      errors: {},
    },
  },
})
@Injectable()
export class AppState {
  static getSlices = createPropertySelectors<AppStateModel>(AppState);

  @Selector()
  static getState(state: AppStateModel) {
    return state;
  }

  @Action(SubmitNewFieldForm)
  add(ctx: StateContext<AppStateModel>) {
    const providedName = ctx.getState().newFieldForm.model?.name?.trim();
    if (!providedName) {
      // submit button should be disabled in that case
      ctx.dispatch(new ResetForm({ path: newFieldFormPath }));
      throw new Error('Field name was not provided.');
    }

    if (ctx.getState().fields.some((field) => field.name === providedName)) {
      ctx.dispatch(new ResetForm({ path: newFieldFormPath }));
      throw new Error('Field name must be unique');
    }

    const newField = new Field(providedName);
    ctx.setState(
      patch<AppStateModel>({
        fields: append<IField>([newField]),
      }),
    );

    ctx.dispatch(new ResetForm({ path: newFieldFormPath }));
  }
}
