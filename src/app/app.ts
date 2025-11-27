import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from './state/app/app.state';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gender } from './models/sheep.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly store = inject(Store);
  protected readonly Gender = Gender;
  protected readonly fields$ = this.store.select(AppState.getSlices.fields);
  protected readonly newSheepForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
    gender: new FormControl<Gender>(Gender.Male, [Validators.required]),
    isBranded: new FormControl<boolean>(false),
    field: new FormControl<string | null>(null, [Validators.required]),
  });

  onAddSheep(): void {
    console.log('Adding new Sheep');
  }
}
