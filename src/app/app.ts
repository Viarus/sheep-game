import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from './state/app/app.state';
import { ReactiveFormsModule } from '@angular/forms';
import { Gender } from './models/sheep.model';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private store = inject(Store);
  protected fields$ = this.store.select(AppState.getSlices.fields);
  protected readonly Gender = Gender;
}
