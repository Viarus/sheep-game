import { ISheep } from './sheep.model';
import { IRowOfSheep } from './row-of-sheep.model';

export type IField = {
  readonly name: string;
  rows: IRowOfSheep[];
  allMaleSheep: ISheep[];
  allFemaleSheep: ISheep[];
  lambs: ISheep[];
};

export class Field implements IField {
  private _rows: IRowOfSheep[] = [];
  private _allMaleSheep: ISheep[] = [];
  private _allFemaleSheep: ISheep[] = [];
  private _lambs: ISheep[] = [];

  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  get rows(): IRowOfSheep[] {
    return this._rows;
  }

  get allMaleSheep(): ISheep[] {
    return this._allMaleSheep;
  }

  get allFemaleSheep(): ISheep[] {
    return this._allFemaleSheep;
  }

  get lambs(): ISheep[] {
    return this._lambs;
  }

  addMaleSheep(sheep: ISheep) {
    this._allMaleSheep.push(sheep);
  }

  addFemaleSheep(sheep: ISheep) {
    this._allFemaleSheep.push(sheep);
  }

  addLamb(sheep: ISheep) {
    this._lambs.push(sheep);
  }

  removeLamb(sheep: ISheep) {
    const index = this.lambs.findIndex((l) => l.name === sheep.name);
    if (index >= 0) {
      this._lambs.splice(index, 1);
    } else {
      throw new Error('Lamb has escaped from growing up, I guess it will be happy forever...');
    }
  }
}
