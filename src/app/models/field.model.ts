import { ISheep } from './sheep.model';
import { IRowOfSheep } from './row-of-sheep.model';

export type IField = {
  readonly name: string;
  readonly rows: IRowOfSheep[];
  readonly allMaleSheep: ISheep[];
  readonly allFemaleSheep: ISheep[];
  readonly lambs: ISheep[];
};

export class Field implements IField {
  readonly name: string;
  readonly rows: IRowOfSheep[] = [];
  readonly allMaleSheep: ISheep[] = [];
  readonly allFemaleSheep: ISheep[] = [];
  readonly lambs: ISheep[] = [];

  constructor(name: string) {
    this.name = name;
  }

  private removeLamb(sheep: ISheep) {
    const index = this.lambs.findIndex((l) => l.name === sheep.name);
    if (index >= 0) {
      this.lambs.splice(index, 1);
    } else {
      throw new Error('Lamb has escaped from growing up, I guess it will be happy forever...');
    }
  }
}
