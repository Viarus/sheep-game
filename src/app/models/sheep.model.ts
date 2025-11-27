export type Gender = 'male' | 'female' | 'lamb';
export type ISheep = {
  readonly name: string;
  readonly gender: Gender;
  readonly isAdult: boolean;
  isBranded: boolean;
  brand(): void;
};

export abstract class Sheep implements ISheep {
  private _isBranded: boolean;
  readonly name: string;
  readonly gender: Gender;

  protected constructor(name: string, gender: Gender, isBranded: boolean = false) {
    this.name = name;
    this.gender = gender;
    this._isBranded = isBranded;
  }

  get isAdult() {
    return this.gender !== 'lamb';
  }

  brand(): void {
    this._isBranded = true;
  }

  get isBranded() {
    return this._isBranded;
  }
}
