import { Sheep } from './sheep.model';
import { RowOfSheep } from './row-of-sheep.model';

export class Field {
  readonly name: string;
  readonly rows: RowOfSheep[] = [];
  readonly allMaleSheep: Sheep[] = [];
  readonly allFemaleSheep: Sheep[] = [];
  readonly lambs: Sheep[] = [];

  constructor(name: string) {
    this.name = name;
  }
}
