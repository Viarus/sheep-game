import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState, NEW_FIELD_FORM_PATH, NEW_SHEEP_FORM_PATH } from './state/app/app.state';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gender, Sheep } from './models/sheep.model';
import { AsyncPipe } from '@angular/common';
import { NgxsFormDirective } from '@ngxs/form-plugin';
import {
  AddRandomField,
  AddRandomSheep,
  BrandSheep,
  SubmitNewFieldForm,
  SubmitNewSheepForm,
} from './state/app/app.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { RulesDialog } from './rules-dialog/rules-dialog';

export type newFieldForm = FormGroup<{
  name: FormControl<string | null>;
}>;

export type newSheepForm = FormGroup<{
  name: FormControl<string | null>;
  gender: FormControl<Gender | null>;
  isBranded: FormControl<boolean | null>;
  field: FormControl<string | null>;
}>;

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, AsyncPipe, NgxsFormDirective, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  protected readonly Gender = Gender;
  protected readonly fields$ = this.store.select(AppState.getSlices.fields);
  protected readonly newFieldFormPath = NEW_FIELD_FORM_PATH;
  protected readonly newSheepFormPath = NEW_SHEEP_FORM_PATH;
  protected readonly newSheepForm: newSheepForm = new FormGroup({
    name: new FormControl<string | null>('', [Validators.required, Validators.maxLength(25)]),
    gender: new FormControl<Gender | null>(Gender.Male, [Validators.required]),
    isBranded: new FormControl<boolean | null>(false),
    field: new FormControl<string | null>(null, [Validators.required]),
  });

  protected readonly newFieldForm: newFieldForm = new FormGroup({
    name: new FormControl<string | null>('', [Validators.required, Validators.maxLength(25)]),
  });

  protected onAddField(): void {
    this.store.dispatch(new SubmitNewFieldForm());
  }

  protected onAddRandomField() {
    this.store.dispatch(new AddRandomField());
  }

  protected onAddSheep(): void {
    this.store.dispatch(new SubmitNewSheepForm());
  }

  protected onAddRandomSheep(): void {
    this.store.dispatch(new AddRandomSheep());
  }

  protected onBrandSheep(fieldName: string, rowId: string, sheep: Sheep | undefined): void {
    if (!sheep) {
      throw new Error('Unable to get the sheep from view.');
    }

    this.store.dispatch(new BrandSheep(fieldName, rowId, sheep));
  }

  protected onShowRules() {
    this.dialog.open(RulesDialog);
  }
}
