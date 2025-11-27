import { Sheep } from './sheep.model';

export type IRowOfSheep = {
  femaleSheep: Sheep | undefined;
  maleSheep: Sheep | undefined;
  isMatingNow: boolean;
  didMatingProcessOccurRecently: boolean;
};

export class RowOfSheep implements IRowOfSheep {
  private _femaleSheep: Sheep | undefined;
  private _maleSheep: Sheep | undefined;
  isMatingNow: boolean;
  didMatingProcessOccurRecently = false;

  constructor(
    femaleSheep: Sheep | undefined,
    maleSheep: Sheep | undefined,
    isMatingNow: boolean = false,
    didMatingProcessOccurRecently: boolean = false,
  ) {
    this._femaleSheep = femaleSheep;
    this._maleSheep = maleSheep;
    this.isMatingNow = isMatingNow;
    this.didMatingProcessOccurRecently = didMatingProcessOccurRecently;
  }

  addFemaleSheep(sheep: Sheep) {
    this._femaleSheep = sheep;
  }

  addMaleSheep(sheep: Sheep) {
    this._maleSheep = sheep;
  }

  get femaleSheep(): Sheep | undefined {
    return this._femaleSheep;
  }

  get maleSheep(): Sheep | undefined {
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
