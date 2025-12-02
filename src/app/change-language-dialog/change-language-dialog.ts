import { Component, DOCUMENT, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

export enum Language {
  English = 'en-US',
  Polish = 'pl',
}

@Component({
  selector: 'app-change-language-dialog',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButton],
  templateUrl: './change-language-dialog.html',
  styleUrl: './change-language-dialog.scss',
})
export class ChangeLanguageDialog {
  protected readonly languageForm = new FormGroup({
    language: new FormControl<string | null>(Language.English, [Validators.required]),
  });
  protected readonly Language = Language;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  onSubmit() {
    const lang = this.languageForm.controls.language.value;

    if (!lang) {
      return;
    }

    const { location } = this.document;
    const url = new URL(location.href);

    const segments = url.pathname.split('/');
    if (segments.length > 1) {
      segments[1] = lang;
    } else {
      segments.push(lang);
    }

    url.pathname = segments.join('/');
    this.document.location.href = url.toString();
  }
}
