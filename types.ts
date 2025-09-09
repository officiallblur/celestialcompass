
export enum ZodiacSign {
  Aries = 'Aries',
  Taurus = 'Taurus',
  Gemini = 'Gemini',
  Cancer = 'Cancer',
  Leo = 'Leo',
  Virgo = 'Virgo',
  Libra = 'Libra',
  Scorpio = 'Scorpio',
  Sagittarius = 'Sagittarius',
  Capricorn = 'Capricorn',
  Aquarius = 'Aquarius',
  Pisces = 'Pisces',
}

export enum ChineseZodiacSign {
    Rat = 'Rat',
    Ox = 'Ox',
    Tiger = 'Tiger',
    Rabbit = 'Rabbit',
    Dragon = 'Dragon',
    Snake = 'Snake',
    Horse = 'Horse',
    Goat = 'Goat',
    Monkey = 'Monkey',
    Rooster = 'Rooster',
    Dog = 'Dog',
    Pig = 'Pig',
}

export interface ZodiacSignInfo {
  name: ZodiacSign;
  symbol: string;
  dateRange: string;
}

export interface ChineseZodiacSignInfo {
  name: ChineseZodiacSign;
  symbol: string;
}


export type HoroscopeTimeframe = 'Daily' | 'Weekly' | 'Monthly';

export interface Horoscope {
  love: string;
  career: string;
  health: string;
}

export interface ZodiacInfo {
  personality_traits: string[];
  compatibility: string;
  ruling_planet: string;
  element: string;
}

export interface ChineseZodiacInfo {
  personality_traits: string[];
  compatibility: string;
  element: string;
  yin_yang: 'Yin' | 'Yang';
}

export interface CompatibilityInfo {
  percentage: number;
  explanation: string;
}

export interface PlanetInfo {
  name: string;
  mass: string;
  diameter: string;
  distance_from_sun: string;
  fun_facts: string[];
}

export interface AstrologicalEvent {
  emoji: string;
  title: string;
  description: string;
}

export interface UserProfile {
  birthDate: string;
  birthPlace: string;
  zodiacSign: ZodiacSign;
}
