import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from './state/app/app.state';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private store = inject(Store);
  protected fields$ = this.store.select(AppState.getSlices.fields);
}
