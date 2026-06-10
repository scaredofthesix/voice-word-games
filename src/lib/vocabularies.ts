/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WordCategory } from '../types';

export const VOCABULARIES: Record<WordCategory, string[]> = {
  space: [
    'star', 'moon', 'mars', 'sun', 'comet', 'orbit', 'rocket', 'meteor',
    'nebula', 'cosmos', 'gravity', 'alien', 'galaxy', 'planet', 'venus', 
    'jupiter', 'crater', 'shuttle', 'telescope', 'spacewalk', 'quantum'
  ],
  animals: [
    'panda', 'koala', 'tiger', 'lion', 'eagle', 'monkey', 'rabbit', 'deer',
    'bear', 'zebra', 'shark', 'camel', 'fox', 'wolf', 'dolphin', 'whale',
    'falcon', 'lizard', 'otter', 'lemur', 'jaguar', 'penguin', 'octopus'
  ],
  action: [
    'jump', 'climb', 'shout', 'bounce', 'fly', 'dash', 'zoom', 'glide',
    'slide', 'spin', 'leap', 'soar', 'ascend', 'sprint', 'shake', 'twist',
    'hover', 'splash', 'burst', 'escape', 'travel', 'pounce', 'vault'
  ],
  cyber: [
    'pixel', 'cyber', 'glowing', 'vector', 'laser', 'matrix', 'robot',
    'future', 'sensor', 'portal', 'circuit', 'node', 'hologram', 'network',
    'bypass', 'latency', 'optics', 'silicon', 'binary', 'server', 'gadget'
  ],
  all: [] // Will merge all themes at runtime
};

export const SPEECH_ALIASES: Record<string, string[]> = {
  // Space
  sun: ['son', 'some', 'sum', 'sin', 'send', 'song', 'soon', 'sun', 'sunny'],
  crater: ['creator', 'creater', 'creature', 'greater', 'grater', 'crate', 'craters', 'kraters'],
  star: ['start', 'store', 'stars', 'stairs', 'starting'],
  moon: ['move', 'mood', 'noon', 'room', 'mum', 'more', 'moons'],
  mars: ['stars', 'map', 'mass', 'miles', 'marsh', 'maas'],
  comet: ['commit', 'comment', 'common', 'comed', 'comets'],
  orbit: ['or bit', 'our bit', 'orgy', 'auditory', 'objects', 'albite', 'orbits'],
  rocket: ['rock it', 'pocket', 'racket', 'rockets', 'look at'],
  meteor: ['media', 'meatier', 'meteors', 'medium'],
  nebula: ['neighbor', 'nibbler', 'nevada', 'nubula', 'nebulae'],
  cosmos: ['cosmo', 'cosmic', 'cause most', 'cosmas'],
  gravity: ['grab it', 'gravitas', 'grabby', 'gravy'],
  alien: ['alliance', 'aliens', 'align', 'alien'],
  galaxy: ['galaxies', 'legacy', 'galaxy\'s'],
  planet: ['planets', 'plan it', 'planning', 'plant'],
  venus: ['penis', 'veins', 'phoenice', 'venice', 'venus'],
  jupiter: ['drop it', 'jupiter\'s', 'jubiter', 'jewish', 'jupiter'],
  shuttle: ['shadow', 'shut', 'shuttlecock', 'shuttles', 'shuttle'],
  telescope: ['telescopes', 'tell us scope'],
  spacewalk: ['space walk', 'space walk', 'space block'],
  quantum: ['content', 'quanta', 'condom', 'quantum'],

  // Animals
  panda: ['panther', 'pandas', 'pander', 'pandora'],
  koala: ['quality', 'koalas', 'quasi', 'koala'],
  tiger: ['tigers', 'tight', 'tigger', 'tagger'],
  lion: ['lying', 'line', 'lions', 'ryan', 'ian'],
  eagle: ['ego', 'eagles', 'eco', 'equal'],
  monkey: ['monkeys', 'money', 'monarchy', 'monk'],
  rabbit: ['rabbits', 'rapid', 'rabid'],
  deer: ['dear', 'dare', 'beer', 'deers'],
  bear: ['bare', 'beer', 'pears', 'bears'],
  zebra: ['zipper', 'zebras', 'debra'],
  shark: ['sharks', 'sharp', 'shock', 'shack'],
  camel: ['camels', 'channel', 'camera', 'campbell'],
  fox: ['box', 'forks', 'focus', 'foxes', 'focks'],
  wolf: ['wool', 'wolves', 'was', 'wood', 'wolf'],
  dolphin: ['dolphins', 'doll pin', 'dalvin'],
  whale: ['while', 'whales', 'well', 'hail'],
  falcon: ['falcons', 'falkon', 'valcon'],
  lizard: ['blizzard', 'lizards', 'wizard'],
  otter: ['other', 'order', 'otters', 'outer', 'water'],
  lemur: ['lemurs', 'limer', 'femur', 'lemur'],
  jaguar: ['jaguars', 'jack wire', 'jagger'],
  penguin: ['penguins', 'pinguim', 'payment', 'penguin'],
  octopus: ['octopuses', 'octapus', 'occupied'],

  // Action
  jump: ['jumps', 'dump', 'job', 'trump'],
  climb: ['climbed', 'climbs', 'crime', 'climen'],
  shout: ['shoot', 'shouts', 'shut', 'shower'],
  bounce: ['bounces', 'bound', 'bounds', 'pounds'],
  fly: ['flight', 'flies', 'fry', 'play'],
  dash: ['dashes', 'death', 'dish', 'task'],
  zoom: ['zooms', 'doom', 'room', 'tune'],
  glide: ['glides', 'guides', 'glide\'s', 'client'],
  slide: ['slides', 'slid', 'slight'],
  spin: ['spins', 'spoon', 'span', 'spring'],
  leap: ['leaps', 'sleep', 'lip', 'leave'],
  soar: ['soars', 'sore', 'saw', 'sure', 'soul'],
  ascend: ['ascends', 'accent', 'ascent', 'send'],
  sprint: ['sprints', 'spring', 'spirit'],
  shake: ['shakes', 'shape', 'sheik'],
  twist: ['twists', 'twit', 'west'],
  hover: ['hovers', 'over', 'halver'],
  splash: ['splashes', 'flash', 'splat'],
  burst: ['bursts', 'best', 'bust', 'first'],
  escape: ['escapes', 'it scape', 'is keep'],
  travel: ['travels', 'trouble', 'gravel'],
  pounce: ['pounces', 'bounce', 'ponds'],
  vault: ['vaults', 'volt', 'vaulted'],

  // Cyber
  pixel: ['pixels', 'pick cell', 'pics'],
  cyber: ['fiber', 'cypher', 'slider'],
  glowing: ['blowing', 'grow', 'growing'],
  vector: ['vectors', 'victor', 'nectar'],
  laser: ['lasers', 'lazer', 'razor', 'leather'],
  matrix: ['matrices', 'metrics', 'may tricks'],
  robot: ['robots', 'row boat', 'robert'],
  future: ['features', 'futures', 'feature'],
  sensor: ['sensors', 'censor', 'center'],
  portal: ['portals', 'bottle', 'portland'],
  circuit: ['circuits', 'sir cut', 'circut'],
  node: ['nodes', 'no', 'note', 'mode', 'known'],
  hologram: ['holograms', 'hollow gram'],
  network: ['networks', 'net work', 'met work'],
  bypass: ['bypasses', 'my pass', 'pie pass'],
  latency: ['lay tendency', 'late and see'],
  optics: ['objects', 'optics', 'abjects'],
  silicon: ['silicone', 'silly con', 'silicium'],
  binary: ['binaries', 'binery', 'binder'],
  server: ['servers', 'suffer', 'service'],
  gadget: ['gadgets', 'get it', 'catch up']
};

// Populate the 'all' category with a shuffled merge of other themes
VOCABULARIES.all = [
  ...VOCABULARIES.space,
  ...VOCABULARIES.animals,
  ...VOCABULARIES.action,
  ...VOCABULARIES.cyber
];

export const TRANSLATIONS: Record<string, { en: string; ru: string; de: string }> = {
  // Space
  star: { en: 'star', ru: 'звезда', de: 'Stern' },
  moon: { en: 'moon', ru: 'луна', de: 'Mond' },
  mars: { en: 'mars', ru: 'марс', de: 'Mars' },
  sun: { en: 'sun', ru: 'солнце', de: 'Sonne' },
  comet: { en: 'comet', ru: 'комета', de: 'Komet' },
  orbit: { en: 'orbit', ru: 'орбита', de: 'Orbit' },
  rocket: { en: 'rocket', ru: 'ракета', de: 'Rakete' },
  meteor: { en: 'meteor', ru: 'метеор', de: 'Meteor' },
  nebula: { en: 'nebula', ru: 'туманность', de: 'Nebel' },
  cosmos: { en: 'cosmos', ru: 'космос', de: 'Kosmos' },
  gravity: { en: 'gravity', ru: 'гравитация', de: 'Schwerkraft' },
  alien: { en: 'alien', ru: 'инопланетянин', de: 'Alien' },
  galaxy: { en: 'galaxy', ru: 'галактика', de: 'Galaxie' },
  planet: { en: 'planet', ru: 'планета', de: 'Planet' },
  venus: { en: 'venus', ru: 'венера', de: 'Venus' },
  jupiter: { en: 'jupiter', ru: 'юпитер', de: 'Jupiter' },
  crater: { en: 'crater', ru: 'кратер', de: 'Krater' },
  shuttle: { en: 'shuttle', ru: 'шаттл', de: 'Shuttle' },
  telescope: { en: 'telescope', ru: 'телескоп', de: 'Teleskop' },
  spacewalk: { en: 'spacewalk', ru: 'выход в космос', de: 'Weltraumspaziergang' },
  quantum: { en: 'quantum', ru: 'квант', de: 'Quant' },

  // Animals
  panda: { en: 'panda', ru: 'панда', de: 'Panda' },
  koala: { en: 'koala', ru: 'коала', de: 'Koala' },
  tiger: { en: 'tiger', ru: 'тигр', de: 'Tiger' },
  lion: { en: 'lion', ru: 'лев', de: 'Löwe' },
  eagle: { en: 'eagle', ru: 'орёл', de: 'Adler' },
  monkey: { en: 'monkey', ru: 'обезьяна', de: 'Affe' },
  rabbit: { en: 'rabbit', ru: 'кролик', de: 'Hase' },
  deer: { en: 'deer', ru: 'олень', de: 'Hirsch' },
  bear: { en: 'bear', ru: 'медведь', de: 'Bär' },
  zebra: { en: 'zebra', ru: 'зебра', de: 'Zebra' },
  shark: { en: 'shark', ru: 'акула', de: 'Hai' },
  camel: { en: 'camel', ru: 'верблюд', de: 'Kamel' },
  fox: { en: 'fox', ru: 'лиса', de: 'Fuchs' },
  wolf: { en: 'wolf', ru: 'волк', de: 'Wolf' },
  dolphin: { en: 'dolphin', ru: 'дельфин', de: 'Delfin' },
  whale: { en: 'whale', ru: 'кит', de: 'Wal' },
  falcon: { en: 'falcon', ru: 'сокол', de: 'Falke' },
  lizard: { en: 'lizard', ru: 'ящерица', de: 'Eidechse' },
  otter: { en: 'otter', ru: 'выдра', de: 'Otter' },
  lemur: { en: 'lemur', ru: 'лемур', de: 'Lemur' },
  jaguar: { en: 'jaguar', ru: 'ягуар', de: 'Jaguar' },
  penguin: { en: 'penguin', ru: 'пингвин', de: 'Pinguin' },
  octopus: { en: 'octopus', ru: 'осьминог', de: 'Oktopus' },

  // Action
  jump: { en: 'jump', ru: 'прыгать', de: 'springen' },
  climb: { en: 'climb', ru: 'карабкаться', de: 'klettern' },
  shout: { en: 'shout', ru: 'кричать', de: 'schreien' },
  bounce: { en: 'bounce', ru: 'отскакивать', de: 'hüpfen' },
  fly: { en: 'fly', ru: 'летать', de: 'fliegen' },
  dash: { en: 'dash', ru: 'рывок', de: 'sprinten' },
  zoom: { en: 'zoom', ru: 'проноситься', de: 'sausen' },
  glide: { en: 'glide', ru: 'планировать', de: 'gleiten' },
  slide: { en: 'slide', ru: 'скользить', de: 'rutschen' },
  spin: { en: 'spin', ru: 'вращаться', de: 'drehen' },
  leap: { en: 'leap', ru: 'прыжок', de: 'springen' },
  soar: { en: 'soar', ru: 'парить', de: 'schweben' },
  ascend: { en: 'ascend', ru: 'подниматься', de: 'aufsteigen' },
  sprint: { en: 'sprint', ru: 'спринт', de: 'rennen' },
  shake: { en: 'shake', ru: 'трясти', de: 'schütteln' },
  twist: { en: 'twist', ru: 'вращать', de: 'drehen' },
  hover: { en: 'hover', ru: 'зависать', de: 'schweben' },
  splash: { en: 'splash', ru: 'всплеск', de: 'spritzen' },
  burst: { en: 'burst', ru: 'взрыв', de: 'platzen' },
  escape: { en: 'escape', ru: 'побег', de: 'entkommen' },
  travel: { en: 'travel', ru: 'путешествовать', de: 'reisen' },
  pounce: { en: 'pounce', ru: 'набрасываться', de: 'stürzen' },
  vault: { en: 'vault', ru: 'перепрыгивать', de: 'springen' },

  // Cyber
  pixel: { en: 'pixel', ru: 'пиксель', de: 'Pixel' },
  cyber: { en: 'cyber', ru: 'кибер', de: 'Cyber' },
  glowing: { en: 'glowing', ru: 'свечение', de: 'leuchtend' },
  vector: { en: 'vector', ru: 'вектор', de: 'Vektor' },
  laser: { en: 'laser', ru: 'лазер', de: 'Laser' },
  matrix: { en: 'matrix', ru: 'матрица', de: 'Matrix' },
  robot: { en: 'robot', ru: 'робот', de: 'Roboter' },
  future: { en: 'future', ru: 'будущее', de: 'Zukunft' },
  sensor: { en: 'sensor', ru: 'датчик', de: 'Sensor' },
  portal: { en: 'portal', ru: 'портал', de: 'Portal' },
  circuit: { en: 'circuit', ru: 'схема', de: 'Schaltkreis' },
  node: { en: 'node', ru: 'узел', de: 'Knoten' },
  hologram: { en: 'hologram', ru: 'голограмма', de: 'Hologramm' },
  network: { en: 'network', ru: 'сеть', de: 'Netzwerk' },
  bypass: { en: 'bypass', ru: 'обход', de: 'Bypass' },
  latency: { en: 'latency', ru: 'задержка', de: 'Latenz' },
  optics: { en: 'optics', ru: 'оптика', de: 'Optik' },
  silicon: { en: 'silicon', ru: 'кремний', de: 'Silizium' },
  binary: { en: 'binary', ru: 'двоичный', de: 'binär' },
  server: { en: 'server', ru: 'сервер', de: 'Server' },
  gadget: { en: 'gadget', ru: 'гаджет', de: 'Gadget' }
};

// Legacy backward compatibility for code expecting RUSSIAN_TRANSLATIONS directly
export const RUSSIAN_TRANSLATIONS: Record<string, string> = Object.keys(TRANSLATIONS).reduce((acc, key) => {
  acc[key] = TRANSLATIONS[key].ru;
  return acc;
}, {} as Record<string, string>);

export function getTranslatedWord(key: string, lang: 'en' | 'ru' | 'de'): string {
  const item = TRANSLATIONS[key.toLowerCase()];
  if (!item) return key;
  return item[lang] || key;
}

export function getLangCode(lang: 'en' | 'ru' | 'de'): string {
  switch (lang) {
    case 'ru': return 'ru-RU';
    case 'de': return 'de-DE';
    default: return 'en-US';
  }
}


/**
 * Gets a random word from the chosen category, avoiding direct duplication.
 * @param category The word theme
 * @param exclude List of words to avoid repeating immediately
 */
export function getRandomWord(category: WordCategory, exclude: string[] = []): string {
  const list = VOCABULARIES[category] || VOCABULARIES.all;
  const filtered = list.filter(word => !exclude.includes(word));
  const pool = filtered.length > 0 ? filtered : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getLevenshteinDistance(a: string, b: string): number {
  const tmp = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1, // deletion
        tmp[i][j - 1] + 1, // insertion
        tmp[i - 1][j - 1] + (a[i - 1] === b[i - 1] ? 0 : 1) // substitution
      );
    }
  }
  return tmp[a.length][b.length];
}

export function getLevenshteinSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  return 1.0 - getLevenshteinDistance(a, b) / maxLen;
}

export function transliterateToPhoneticLatin(text: string): string {
  const mapping: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss'
  };
  return text.toLowerCase().split('').map(char => mapping[char] || char).join('');
}

/**
 * Soundex algorithm implementation.
 * Maps consonant sounds to numbers to evaluate acoustic similarity.
 * We include an option to convert the first character to its number group sound as well,
 * making it "first-character flexible" (e.g. "crater" starting with C and "greater" starting with G).
 */
export function getSoundex(word: string, flexibleFirstLetter = true): string {
  const phonetic = transliterateToPhoneticLatin(word);
  const clean = phonetic.replace(/[^a-z]/g, '');
  if (!clean) return '';

  const getSoundexCode = (char: string): string => {
    if ('bfpv'.includes(char)) return '1';
    if ('cgjkqsxz'.includes(char)) return '2';
    if ('dt'.includes(char)) return '3';
    if ('l'.includes(char)) return '4';
    if ('mn'.includes(char)) return '5';
    if ('r'.includes(char)) return '6';
    return ''; // a, e, i, o, u, y, h, w
  };

  const firstChar = clean[0];
  let code = flexibleFirstLetter ? getSoundexCode(firstChar) || firstChar : firstChar;
  let prevCode = getSoundexCode(firstChar);

  for (let i = 1; i < clean.length; i++) {
    const charCode = getSoundexCode(clean[i]);
    if (charCode && charCode !== prevCode) {
      code += charCode;
      prevCode = charCode;
    } else if (!charCode) {
      // If vowel, reset prevCode tracking to allow consecutive sounds
      prevCode = '';
    }
    if (code.length >= 4) break;
  }

  return (code + '000').slice(0, 4);
}

/**
 * Checks if a speech text matches the target platform word, using direct match, substring containment, 
 * punctuation/space cleansing, dynamic sound-alike dictionary lookup, and similarity algorithms.
 */
export function isSpeechMatch(platformWord: string, speechText: string): boolean {
  if (!speechText) return false;

  const target = platformWord.toLowerCase().trim();
  const rawSpeech = speechText.toLowerCase().trim();

  // 1. Direct match or direct substring include
  if (rawSpeech === target || rawSpeech.includes(target)) return true;

  // 1B. Normalized direct match without umlauts
  const normDirectTarget = target.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  const normDirectTargetSimple = target.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 's');
  const normDirectSpeech = rawSpeech.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  const normDirectSpeechSimple = rawSpeech.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 's');
  
  if (normDirectSpeech === normDirectTarget || 
      normDirectSpeechSimple === normDirectTargetSimple || 
      normDirectSpeech.includes(normDirectTarget) || 
      normDirectSpeechSimple.includes(normDirectTargetSimple)) {
    return true;
  }

  // 2. Clear out non-alphanumeric except spaces for tokenization
  const cleanSpeech = rawSpeech.replace(/[^a-z0-9а-яёäöüß ]/gi, ' ').trim();
  const tokens = cleanSpeech.split(/\s+/).filter(Boolean);

  // 3. Match any token exactly or check if token starts with/is target
  if (tokens.includes(target)) return true;
  if (tokens.some(t => t.startsWith(target) || target.startsWith(t))) return true;

  // 3B. Match normalized tokens (handling German transliteration or standard vowels)
  for (const token of tokens) {
    const normToken = token.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    const normTokenSimple = token.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 's');
    if (normToken === normDirectTarget || 
        normTokenSimple === normDirectTargetSimple || 
        normToken === normDirectTargetSimple || 
        normTokenSimple === normDirectTarget) {
      return true;
    }
  }

  // 4. Combined string without spaces matching (e.g., "space walk" -> "spacewalk")
  const combinedSpeech = cleanSpeech.replace(/\s+/g, '');
  if (combinedSpeech.includes(target)) return true;

  // 5. Dynamic Phonetic Algorithm Matching
  const targetPhonetic = transliterateToPhoneticLatin(target);
  const targetSoundex = getSoundex(target, true);
  for (const token of tokens) {
    // A. Check phonetic Soundex equivalence
    if (token.length >= 3) {
      const tokenSoundex = getSoundex(token, true);
      if (tokenSoundex === targetSoundex) return true;
    }

    // B. Check Levenshtein distance similarity on transliterated strings
    const tokenPhonetic = transliterateToPhoneticLatin(token);
    const sim = getLevenshteinSimilarity(targetPhonetic, tokenPhonetic);
    const threshold = targetPhonetic.length <= 4 ? 0.76 : 0.72; // shorter words require higher string parity
    if (sim >= threshold) return true;
  }

  // 6. Hardcoded fallback aliases for extremely divergent phonetic transcriptions (e.g., "venus" as "penis")
  const aliases = SPEECH_ALIASES[target] || [];
  for (const alias of aliases) {
    const cleanAlias = alias.toLowerCase().trim();
    if (combinedSpeech === cleanAlias || combinedSpeech.includes(cleanAlias)) return true;
    if (tokens.includes(cleanAlias)) return true;
  }

  return false;
}
