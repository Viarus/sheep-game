import { Sheep } from '../../models/sheep.model';

export class SubmitNewFieldForm {
  static readonly type = '[App] Submit new field form';
}

export class AddRandomField {
  static readonly type = '[App] Add random field';
}

export class SubmitNewSheepForm {
  static readonly type = '[App] Submit new sheep form';
}

export class AddRandomSheep {
  static readonly type = '[App] Add random sheep';
}

export class BrandSheep {
  static readonly type = '[App] Brand sheep';
  constructor(
    public fieldName: string,
    public rowId: string,
    public sheep: Sheep,
  ) {}
}
