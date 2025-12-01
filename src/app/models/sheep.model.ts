import { generate6RandomDigitsToString } from '../shared/utilities';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Lamb = 'lamb',
}

export type ISheep = {
  readonly id: string;
  readonly name: string;
  readonly gender: Gender;
  readonly isBranded: boolean;
};

export class Sheep implements ISheep {
  readonly id: string;
  readonly name: string;
  readonly gender: Gender;
  readonly isBranded: boolean;

  constructor(name: string, gender: Gender, isBranded: boolean = false) {
    this.id = `${name}: ${generate6RandomDigitsToString()}`;
    this.name = name;
    this.gender = gender;
    this.isBranded = isBranded;
  }
}
