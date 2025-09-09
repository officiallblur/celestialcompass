
import { ZodiacSign, ZodiacSignInfo, ChineseZodiacSign, ChineseZodiacSignInfo } from './types';

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  { name: ZodiacSign.Aries, symbol: '♈', dateRange: 'Mar 21 - Apr 19' },
  { name: ZodiacSign.Taurus, symbol: '♉', dateRange: 'Apr 20 - May 20' },
  { name: ZodiacSign.Gemini, symbol: '♊', dateRange: 'May 21 - Jun 20' },
  { name: ZodiacSign.Cancer, symbol: '♋', dateRange: 'Jun 21 - Jul 22' },
  { name: ZodiacSign.Leo, symbol: '♌', dateRange: 'Jul 23 - Aug 22' },
  { name: ZodiacSign.Virgo, symbol: '♍', dateRange: 'Aug 23 - Sep 22' },
  { name: ZodiacSign.Libra, symbol: '♎', dateRange: 'Sep 23 - Oct 22' },
  { name: ZodiacSign.Scorpio, symbol: '♏', dateRange: 'Oct 23 - Nov 21' },
  { name: ZodiacSign.Sagittarius, symbol: '♐', dateRange: 'Nov 22 - Dec 21' },
  { name: ZodiacSign.Capricorn, symbol: '♑', dateRange: 'Dec 22 - Jan 19' },
  { name: ZodiacSign.Aquarius, symbol: '♒', dateRange: 'Jan 20 - Feb 18' },
  { name: ZodiacSign.Pisces, symbol: '♓', dateRange: 'Feb 19 - Mar 20' },
];

export const CHINESE_ZODIAC_SIGNS: ChineseZodiacSignInfo[] = [
  { name: ChineseZodiacSign.Rat, symbol: '🐀' },
  { name: ChineseZodiacSign.Ox, symbol: '🐂' },
  { name: ChineseZodiacSign.Tiger, symbol: '🐅' },
  { name: ChineseZodiacSign.Rabbit, symbol: '🐇' },
  { name: ChineseZodiacSign.Dragon, symbol: '🐉' },
  { name: ChineseZodiacSign.Snake, symbol: '🐍' },
  { name: ChineseZodiacSign.Horse, symbol: '🐎' },
  { name: ChineseZodiacSign.Goat, symbol: '🐐' },
  { name: ChineseZodiacSign.Monkey, symbol: '🐒' },
  { name: ChineseZodiacSign.Rooster, symbol: '🐓' },
  { name: ChineseZodiacSign.Dog, symbol: '🐕' },
  { name: ChineseZodiacSign.Pig, symbol: '🐖' },
];

export const PLANETS: string[] = [
  "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"
];
