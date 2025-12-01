import { Sheep } from './sheep.model';
import { RowOfSheep } from './row-of-sheep.model';

export class Field {
  readonly name: string;
  readonly rows: RowOfSheep[] = [];
  readonly maleSheepCount: number = 0;
  readonly femaleSheepCount: number = 0;
  readonly lambs: Sheep[] = [];

  constructor(name: string) {
    this.name = name;
  }
}
