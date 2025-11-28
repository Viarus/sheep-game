import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, createPropertySelectors } from '@ngxs/store';
import {
  AddRandomField,
  AddRandomSheep,
  SubmitNewFieldForm,
  SubmitNewSheepForm,
} from './app.actions';
import { Field, IField } from '../../models/field.model';
import { append, patch } from '@ngxs/store/operators';
import { ResetForm, UpdateFormValue } from '@ngxs/form-plugin';
import { Gender } from '../../models/sheep.model';
import { generate6RandomDigitsToString } from '../../shared/utilities';

export const newFieldFormPath = 'app.newFieldForm';
export const newSheepFormPath = 'app.newSheepForm';

export type newFieldFormModel = {
  name: string | null | undefined;
};

export type newSheepFormModel = {
  name: string | null | undefined;
  gender: Gender | null | undefined;
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
        name: null,
      },
      dirty: false,
      status: '',
      errors: {},
    },
    newSheepForm: {
      model: {
        name: null,
        gender: Gender.Male,
        isBranded: false,
        field: null,
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
  submitNewFieldForm(ctx: StateContext<AppStateModel>) {
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
    ctx.dispatch(
      new UpdateFormValue({ value: providedName, path: newSheepFormPath, propertyPath: 'field' }),
    );
  }

  @Action(AddRandomField)
  addRandomField(ctx: StateContext<AppStateModel>) {
    const newFieldName = `field: ${generate6RandomDigitsToString()}`;
    const newField = new Field(newFieldName);
    ctx.setState(
      patch<AppStateModel>({
        fields: append<IField>([newField]),
      }),
    );

    ctx.dispatch(
      new UpdateFormValue({ value: newFieldName, path: newSheepFormPath, propertyPath: 'field' }),
    );
  }

  @Action(SubmitNewSheepForm)
  submitNewSheepForm(ctx: StateContext<AppStateModel>) {
    const formModel = ctx.getState().newSheepForm.model;
    if (!formModel) {
      // submit button should be disabled in that case
      ctx.dispatch(new ResetForm({ path: newSheepFormPath }));
      throw new Error('Form model was not provided.');
    }

    const providedName = formModel.name?.trim();
    if (!providedName) {
      // submit button should be disabled in that case
      ctx.dispatch(new ResetForm({ path: newSheepFormPath }));
      throw new Error('Sheep name was not provided.');
    }

    const providedGender = formModel.gender;
    if (!providedGender) {
      // submit button should be disabled in that case
      ctx.dispatch(new ResetForm({ path: newSheepFormPath }));
      throw new Error('Gender was not provided.');
    }

    const providedField = formModel.field;
    if (!providedField) {
      // submit button should be disabled in that case
      ctx.dispatch(new ResetForm({ path: newSheepFormPath }));
      throw new Error('Field name was not provided.');
    }

    // const newSheep = new Sheep(providedName, providedGender, !!formModel.isBranded);
    // ctx.setState(
    //   patch<AppStateModel>({
    //     fields: updateItem<IField>((field) => field.name === providedField, patch<IField>({})),
    //   }),
    // );

    ctx.dispatch(new ResetForm({ path: newFieldFormPath }));
  }

  @Action(AddRandomSheep)
  addRandomSheep(ctx: StateContext<AppStateModel>) {}
}
