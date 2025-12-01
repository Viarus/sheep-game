import { Sheep } from './sheep.model';
import { generate6RandomDigitsToString } from '../shared/utilities';

interface ISheepMatingArgs {
  femaleSheep?: Sheep;
  maleSheep?: Sheep;
  isMatingNow?: boolean;
  didMatingProcessOccurRecently?: boolean;
}

export class RowOfSheep {
  readonly id: string;
  readonly femaleSheep: Sheep | undefined;
  readonly maleSheep: Sheep | undefined;
  readonly isMatingNow: boolean;
  readonly didMatingProcessOccurRecently: boolean;

  constructor({
    femaleSheep,
    maleSheep,
    isMatingNow = false,
    didMatingProcessOccurRecently = false,
  }: ISheepMatingArgs) {
    this.id = `row: ${generate6RandomDigitsToString()}`;
    this.femaleSheep = femaleSheep;
    this.maleSheep = maleSheep;
    this.isMatingNow = isMatingNow;
    this.didMatingProcessOccurRecently = didMatingProcessOccurRecently;
  }
}
