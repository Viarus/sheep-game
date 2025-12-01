import { ISheep } from './sheep.model';
import { generate6RandomDigitsToString } from '../shared/utilities';

interface ISheepMatingArgs {
  femaleSheep?: ISheep;
  maleSheep?: ISheep;
  isMatingNow?: boolean;
  didMatingProcessOccurRecently?: boolean;
}

export type IRowOfSheep = {
  id: string;
  femaleSheep: ISheep | undefined;
  maleSheep: ISheep | undefined;
  isMatingNow: boolean;
  didMatingProcessOccurRecently: boolean;
};

export class RowOfSheep implements IRowOfSheep {
  readonly id: string;
  readonly femaleSheep: ISheep | undefined;
  readonly maleSheep: ISheep | undefined;
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
