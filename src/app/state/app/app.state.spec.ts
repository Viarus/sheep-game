import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { AppState, AppStateModel } from './app.state';
import { AppAction } from './app.actions';

describe('App store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([AppState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: AppStateModel = {
      items: ['item-1']
    };
    store.dispatch(new AppAction('item-1'));
    const actual = store.selectSnapshot(AppState.getState);
    expect(actual).toEqual(expected);
  });

});
