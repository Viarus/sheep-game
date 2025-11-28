import { Gender, ISheep } from './sheep.model';

export type IRowOfSheep = {
  femaleSheep: ISheep | undefined;
  maleSheep: ISheep | undefined;
  isMatingNow: boolean;
  didMatingProcessOccurRecently: boolean;
};

export class RowOfSheep implements IRowOfSheep {
  private _femaleSheep: ISheep | undefined;
  private _maleSheep: ISheep | undefined;
  isMatingNow: boolean = false;
  didMatingProcessOccurRecently = false;

  constructor(sheep: ISheep) {
    this.addSheep(sheep);
  }

  addSheep(sheep: ISheep) {
    if (!!this._femaleSheep && this._maleSheep) {
      throw new Error('Row is full!');
    }

    if (sheep.gender === Gender.Female) {
      this._femaleSheep = sheep;
      return;
    }

    this._maleSheep = sheep;
  }

  get femaleSheep(): ISheep | undefined {
    return this._femaleSheep;
  }

  get maleSheep(): ISheep | undefined {
    return this._maleSheep;
  }

  get possibleToMate(): boolean {
    return (
      !this.isMatingNow &&
      !this.didMatingProcessOccurRecently &&
      [this._maleSheep, this._femaleSheep].every((sheep) => !!sheep && !sheep.isBranded)
    );
  }
}
