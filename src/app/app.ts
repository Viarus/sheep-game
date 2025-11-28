import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState, newFieldFormPath, newSheepFormPath } from './state/app/app.state';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gender } from './models/sheep.model';
import { AsyncPipe } from '@angular/common';
import { NgxsFormDirective } from '@ngxs/form-plugin';
import { SubmitNewFieldForm } from './state/app/app.actions';

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
  imports: [ReactiveFormsModule, AsyncPipe, NgxsFormDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly store = inject(Store);
  protected readonly Gender = Gender;
  protected readonly fields$ = this.store.select(AppState.getSlices.fields);
  protected readonly newSheepForm: newSheepForm = new FormGroup({
    name: new FormControl<string | null>('', [Validators.required, Validators.maxLength(50)]),
    gender: new FormControl<Gender | null>(Gender.Male, [Validators.required]),
    isBranded: new FormControl<boolean | null>(false),
    field: new FormControl<string | null>(null, [Validators.required]),
  });

  protected readonly newFieldForm: newFieldForm = new FormGroup({
    name: new FormControl<string | null>('', [Validators.required, Validators.maxLength(50)]),
  });

  protected onAddSheep(): void {
    console.log('Adding a new sheep');
  }

  protected onAddRandomSheep(): void {
    console.log('Adding a new random sheep');
  }

  protected onAddField(): void {
    this.store.dispatch(new SubmitNewFieldForm());
  }

  protected onCreateRandomField() {
    console.log('Adding a new random field');
  }

  protected readonly newFieldFormPath = newFieldFormPath;
  protected readonly newSheepFormPath = newSheepFormPath;
}
