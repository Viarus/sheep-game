import { Injectable } from '@angular/core';
import { Action, createPropertySelectors, Selector, State, StateContext } from '@ngxs/store';
import {
  AddRandomField,
  AddRandomSheep,
  SubmitNewFieldForm,
  SubmitNewSheepForm,
} from './app.actions';
import { Field, IField } from '../../models/field.model';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ResetForm, UpdateFormValue } from '@ngxs/form-plugin';
import { Gender, ISheep, Sheep } from '../../models/sheep.model';
import { generate6RandomDigitsToString, getRandomBoolean } from '../../shared/utilities';
import { IRowOfSheep, RowOfSheep } from '../../models/row-of-sheep.model';
import { delay, first, Subject } from 'rxjs';

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
      this.resetFormSheepName(ctx);
      throw new Error('Form model was not provided.');
    }

    const providedName = formModel.name?.trim();
    if (!providedName) {
      // submit button should be disabled in that case
      this.resetFormSheepName(ctx);
      throw new Error('Sheep name was not provided.');
    }

    const providedGender = formModel.gender;
    if (!providedGender) {
      // submit button should be disabled in that case
      this.resetFormSheepName(ctx);
      throw new Error('Gender was not provided.');
    }

    const providedFieldName = formModel.field;
    if (!providedFieldName) {
      // submit button should be disabled in that case
      this.resetFormSheepName(ctx);
      throw new Error('Field name was not provided.');
    }

    this.addSheepToField(
      ctx,
      new Sheep(providedName, providedGender, !!formModel.isBranded),
      providedFieldName,
    );

    this.resetFormSheepName(ctx);
  }

  @Action(AddRandomSheep)
  addRandomSheep(ctx: StateContext<AppStateModel>) {
    const randomNumber = Math.floor(Math.random() * 3);
    let gender: Gender;
    switch (randomNumber) {
      case 0:
        gender = Gender.Male;
        break;
      case 1:
        gender = Gender.Female;
        break;
      case 2:
        gender = Gender.Lamb;
        break;
      default:
        throw new Error('Invalid random number.');
    }

    const providedFieldName = ctx.getState().newSheepForm.model?.field;
    if (!providedFieldName) {
      // submit button should be disabled in that case
      this.resetFormSheepName(ctx);
      throw new Error('Field name was not provided.');
    }

    const randomName = `sheep: ${generate6RandomDigitsToString()}`;
    this.addSheepToField(ctx, new Sheep(randomName, gender), providedFieldName);
    this.resetFormSheepName(ctx);
  }

  private addSheepToField(
    ctx: StateContext<AppStateModel>,
    sheep: ISheep,
    fieldName: string,
  ): void {
    const field = ctx.getState().fields.find((field) => field.name === fieldName);
    if (!field) {
      throw new Error('Field name is incorrect.');
    }

    if (sheep.gender === Gender.Lamb) {
      this.addLambToField(ctx, sheep, fieldName);
      return;
    }

    if (sheep.gender === Gender.Female) {
      this.insertFemaleSheepToFieldFemaleSheepArray(ctx, sheep, fieldName);
    } else {
      this.insertMaleSheepToFieldMaleSheepArray(ctx, sheep, fieldName);
    }

    const isNewRowNeeded =
      (field.rows.length === field.allMaleSheep.length && sheep.gender === Gender.Male) ||
      (field.rows.length === field.allFemaleSheep.length && sheep.gender === Gender.Female);

    if (isNewRowNeeded) {
      const newRow =
        sheep.gender === Gender.Female
          ? new RowOfSheep({ femaleSheep: sheep })
          : new RowOfSheep({ maleSheep: sheep });

      this.appendNewRowToField(ctx, newRow, fieldName);
      return;
    }

    let rowId: string;
    if (sheep.gender === Gender.Male) {
      rowId = this.insertMaleSheepToFirstAvailableExistingRowInField(ctx, sheep, fieldName);
    } else {
      rowId = this.insertFemaleSheepToFirstAvailableExistingRowInField(ctx, sheep, fieldName);
    }

    this.startMatingProcess(ctx, fieldName, rowId);
  }

  private addLambToField(ctx: StateContext<AppStateModel>, sheep: ISheep, fieldName: string) {
    if (sheep.gender !== Gender.Lamb) {
      throw new Error('Sheep gender is incorrect.');
    }

    ctx.setState(
      patch<AppStateModel>({
        fields: updateItem<IField>(
          (f) => f.name === fieldName,
          patch<IField>({ lambs: append<ISheep>([sheep]) }),
        ),
      }),
    );

    const startGrowingProcess$ = new Subject<void>();
    startGrowingProcess$.pipe(delay(12000), first()).subscribe(() => {
      ctx.setState(
        patch<AppStateModel>({
          fields: updateItem<IField>(
            (f) => f.name === fieldName,
            patch<IField>({ lambs: removeItem<ISheep>((lamb) => lamb.id === sheep.id) }),
          ),
        }),
      );

      // Lamb is getting a new id on growing up.
      const newSheep = new Sheep(sheep.name, getRandomBoolean ? Gender.Male : Gender.Female);
      this.addSheepToField(ctx, newSheep, fieldName);
    });

    startGrowingProcess$.next();
  }

  private insertFemaleSheepToFieldFemaleSheepArray(
    ctx: StateContext<AppStateModel>,
    sheep: ISheep,
    fieldName: string,
  ) {
    if (sheep.gender !== Gender.Female) {
      throw new Error('Sheep gender is incorrect.');
    }

    ctx.setState(
      patch<AppStateModel>({
        fields: updateItem<IField>(
          (f) => f.name === fieldName,
          patch<IField>({ allFemaleSheep: append<ISheep>([sheep]) }),
        ),
      }),
    );
  }

  private insertMaleSheepToFieldMaleSheepArray(
    ctx: StateContext<AppStateModel>,
    sheep: ISheep,
    fieldName: string,
  ) {
    if (sheep.gender !== Gender.Male) {
      throw new Error('Sheep gender is incorrect.');
    }

    ctx.setState(
      patch<AppStateModel>({
        fields: updateItem<IField>(
          (f) => f.name === fieldName,
          patch<IField>({ allMaleSheep: append<ISheep>([sheep]) }),
        ),
      }),
    );
  }

  private appendNewRowToField(
    ctx: StateContext<AppStateModel>,
    newRow: RowOfSheep,
    fieldName: string,
  ) {
    ctx.setState(
      patch<AppStateModel>({
        fields: updateItem<IField>(
          (f) => f.name === fieldName,
          patch<IField>({ rows: append<IRowOfSheep>([newRow]) }),
        ),
      }),
    );
  }

  private insertMaleSheepToFirstAvailableExistingRowInField(
    ctx: StateContext<AppStateModel>,
    sheep: ISheep,
    fieldName: string,
  ) {
    const rowId = ctx
      .getState()
      .fields.find((f) => f.name === fieldName)
      ?.rows.find((r) => r.maleSheep === undefined)?.id;

    if (!rowId) {
      throw new Error('No empty rows!');
    }

    ctx.setState(
      patch<AppStateModel>({
        fields: updateItem<IField>(
          (f) => f.name === fieldName,
          patch<IField>({
            rows: updateItem<IRowOfSheep>(
              (r) => r.id === rowId,
              patch<IRowOfSheep>({ maleSheep: sheep }),
            ),
          }),
        ),
      }),
    );

    return rowId;
  }

  private insertFemaleSheepToFirstAvailableExistingRowInField(
    ctx: StateContext<AppStateModel>,
    sheep: ISheep,
    fieldName: string,
  ) {
    const rowId = ctx
      .getState()
      .fields.find((f) => f.name === fieldName)
      ?.rows.find((r) => r.femaleSheep === undefined)?.id;

    if (!rowId) {
      throw new Error('No empty rows!');
    }

    ctx.setState(
      patch<AppStateModel>({
        fields: updateItem<IField>(
          (f) => f.name === fieldName,
          patch<IField>({
            rows: updateItem<IRowOfSheep>(
              (r) => !r.femaleSheep,
              patch<IRowOfSheep>({ femaleSheep: sheep }),
            ),
          }),
        ),
      }),
    );

    return rowId;
  }

  private resetFormSheepName(ctx: StateContext<AppStateModel>) {
    ctx.dispatch(
      new UpdateFormValue({ value: null, path: newSheepFormPath, propertyPath: 'name' }),
    );
  }

  private startMatingProcess(ctx: StateContext<AppStateModel>, fieldName: string, rowId: string) {
    const row = ctx
      .getState()
      .fields.find((f) => f.name === fieldName)
      ?.rows.find((r) => r.id === rowId);

    if (!row) {
      throw new Error("Row doesn't exist!");
    }

    const isPossibleToMate =
      [row.maleSheep, row.femaleSheep].every((sheep) => !!sheep && !sheep.isBranded) &&
      !row.isMatingNow &&
      !row.didMatingProcessOccurRecently;

    if (!isPossibleToMate) {
      return;
    }

    const startMatingCooldownProcess$ = new Subject<void>();
    startMatingCooldownProcess$.pipe(delay(8000), first()).subscribe(() => {
      this.startMatingProcess(ctx, fieldName, rowId);
    });

    const startMatingProcess$ = new Subject<void>();
    startMatingProcess$.pipe(delay(5000), first()).subscribe(() => {
      this.setRowMating(ctx, fieldName, rowId, false);
      if (row.maleSheep?.isBranded || row.femaleSheep?.isBranded) {
        return;
      }

      // 2/3 chances of mating being successful
      const wasMatingSuccessful = Math.floor(Math.random() * 3) < 2;
      if (wasMatingSuccessful) {
        this.addLambToField(ctx, new Sheep('Little Bob', Gender.Lamb), fieldName);
      }

      startMatingCooldownProcess$.next();
    });

    this.setRowMating(ctx, fieldName, rowId, true);
    startMatingProcess$.next();
  }

  private setRowMating(
    ctx: StateContext<AppStateModel>,
    fieldName: string,
    rowId: string,
    isMatingNow: boolean,
  ) {
    ctx.setState(
      patch<AppStateModel>({
        fields: updateItem<IField>(
          (f) => f.name === fieldName,
          patch<IField>({
            rows: updateItem<IRowOfSheep>(
              (r) => r.id === rowId,
              patch<IRowOfSheep>({ isMatingNow }),
            ),
          }),
        ),
      }),
    );
  }
}
