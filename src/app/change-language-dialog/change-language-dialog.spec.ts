import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLanguageDialog } from './change-language-dialog';

describe('ChangeLanguageDialog', () => {
  let component: ChangeLanguageDialog;
  let fixture: ComponentFixture<ChangeLanguageDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeLanguageDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeLanguageDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
