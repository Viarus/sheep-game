import { ISheep } from './sheep.model';
import { IRowOfSheep } from './row-of-sheep.model';

export type IField = {
  readonly name: string;
  readonly rows: IRowOfSheep[];
  readonly allSheep: ISheep[];
  readonly allMaleSheep: ISheep[];
  readonly allFemaleSheep: ISheep[];
  readonly lambs: ISheep[];
};

export class Field implements IField {
  readonly name: string;
  readonly rows: IRowOfSheep[] = [];
  readonly allSheep: ISheep[] = [];
  readonly allMaleSheep: ISheep[] = [];
  readonly allFemaleSheep: ISheep[] = [];
  readonly lambs: ISheep[] = [];

  constructor(name: string) {
    this.name = name;
  }
}
