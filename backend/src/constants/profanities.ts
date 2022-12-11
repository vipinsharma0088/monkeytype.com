import _ from "lodash";
import words from 'profane-words';

// Sorry for the bad words
export const profanities = [
  "ahole", 
  "amcik", 
  "andskota", 
  "anus", 
  "arschloch", 
  "arse", 
  "ash0le", 
  "asholes", 
  "assh0le", 
  "assh0lez", 
  "asshole", 
  "assholes", 
  "assholz", 
  "assrammer", 
  "asswipe", 
  "ayir", 
  "azzhole", 
  "b!+ch", 
  "b!tch", 
  "b00b", 
  "b00bs", 
  "b17ch", 
  "b1tch", 
  "bassterds", 
  "bastard", 
  "bastards", 
  "bastardz", 
  "basterds", 
  "basterdz", 
  "bi+ch", 
  "bi7ch", 
  "biatch", 
  "bitch", 
  "bitches", 
  "bitly", 
  "blow job", 
  "blowjob", 
  "boffing", 
  "boiolas", 
  "bollock", 
  "boobs", 
  "breasts", 
  "buceta", 
  "butt-pirate", 
  "butthole", 
  "buttwipe", 
  "c0ck", 
  "c0cks", 
  "c0k", 
  "cabron", 
  "carpet muncher", 
  "cawk", 
  "cawks", 
  "cazzo", 
  "chink", 
  "chraa", 
  "chuj", 
  "cipa", 
  "clit", 
  "clits", 
  "cnts", 
  "cntz", 
  "cock", 
  "cock-head", 
  "cock-sucker", 
  "cockhead", 
  "cocks", 
  "cocksucker", 
  "crap", 
  "cum", 
  "cunt", 
  "cunts", 
  "cuntz", 
  "d4mn", 
  "damn", 
  "daygo", 
  "dego", 
  "dick", 
  "dike", 
  "dild0", 
  "dild0s", 
  "dildo", 
  "dildos", 
  "dilld0", 
  "dilld0s", 
  "dirsa", 
  "dominatricks", 
  "dominatrics", 
  "dominatrix", 
  "dupa", 
  "dyke", 
  "dziwka", 
  "ejackulate", 
  "ejakulate", 
  "ekrem", 
  "ekto", 
  "enculer", 
  "enema", 
  "f u c k", 
  "f u c k e r", 
  "faen", 
  "fag", 
  "fag1t", 
  "faget", 
  "fagg1t", 
  "faggit", 
  "faggot", 
  "fagit", 
  "fags", 
  "fagz", 
  "faig", 
  "faigs", 
  "fanculo", 
  "fanny", 
  "fart", 
  "fatass", 
  "fcuk", 
  "feces", 
  "felcher", 
  "ficken", 
  "fitt", 
  "flikker", 
  "flipping the bird", 
  "foreskin", 
  "fotze", 
  "fuck", 
  "fudge packer", 
  "fukah", 
  "fuken", 
  "fuker", 
  "fukin", 
  "fukk", 
  "fukkah", 
  "fukken", 
  "fukker", 
  "fukkin", 
  "futkretzn", 
  "fux0r", 
  "g00k", 
  "gayboy", 
  "gaygirl", 
  "gayz", 
  "god-damned", 
  "gook", 
  "guiena", 
  "h00r", 
  "h0ar", 
  "h0re", 
  "h4x0r", 
  "helvete", 
  "hoar", 
  "hoer",
  "honkey",
  "hoor",
  "hoore",
  "hore",
  "huevon",
  "injun", 
  "jackoff", 
  "japs", 
  "jerk-off", 
  "jisim", 
  "jism", 
  "jiss", 
  "jizm", 
  "jizz", 
  "kanker", 
  "kawk", 
  "klootzak", 
  "knob", 
  "knobs",
   "knobz", 
   "knulle", 
   "kraut", 
   "kuksuger", 
   "kunt", 
   "kunts", 
   "kuntz", 
   "kurac", 
   "kurwa", 
   "kusi", 
   "kyrpa", 
   "l3i+ch", 
   "l3itch", 
   "lesbo", 
   "lezzian", 
   "lipshits", 
   "lipshitz", 
   "mamhoon", 
   "masochist", 
   "masokist", 
   "massterbait", 
   "masstrbait", 
   "masstrbate", 
   "masterbaiter", 
   "masterbat", 
   "masterbat3", 
   "masterbate", 
   "masterbates", 
   "masturbat", 
   "masturbate", 
   "merd", 
   "mibun", 
   "miodec", 
   "mofo", 
   "monkleigh", 
   "motherfucker", 
   "mouliewop", 
   "muie", 
   "mulkku", 
   "muschi", 
   "n1gr", 
   "nastt", 
   "nazi", 
   "nazis", 
   "nepesaurio", 
   "ni99a", 
   "ni99er", 
   "niga", 
   "niger", 
   "nigga", 
   "niggas", 
   "nigger", 
   "nigger;", 
   "nigur;", 
   "niiger;", 
   "niigr;", 
   "niqqa", 
   "niqqer", 
   "nutsack", 
   "orafis", 
   "orgasim;", 
   "orgasm", 
   "orgasum", 
   "oriface", 
   "orifice", 
   "orifiss", 
   "orospu", 
   "p0rn", 
   "packi", 
   "packie", 
   "packy", 
   "paki", 
   "pakie", 
   "paky", 
   "paska", 
   "pecker", 
   "peeenus", 
   "peeenusss", 
   "peenus", 
   "peinus", 
   "pen1s", 
   "penas", 
   "penis", 
   "penis-breath", 
   "penus", 
   "penuus", 
   "perse", 
   "phuc", 
   "phuck", 
   "phuk", 
   "phuker", 
   "phukker", 
   "picka", 
   "pierdol", 
   "pillu", 
   "pimmel", 
   "pimpis", 
   "piss", 
   "pizda", 
   "poonani", 
   "poontsee", 
   "porn", 
   "pr0n", 
   "pr1c", 
   "pr1ck", 
   "pr1k", 
   "preteen", 
   "pula", 
   "pule", 
   "puss", 
   "pusse", 
   "pussee", 
   "pussy", 
   "puta", 
   "puto", 
   "puuke", 
   "puuker", 
   "qahbeh", 
   "queef", 
   "qweers", 
   "qweerz", 
   "qweir", 
   "rautenberg", 
   "recktum", 
   "rectum", 
   "retard", 
   "s.o.b.", 
   "sadist", 
   "scank", 
   "schaffer", 
   "scheiss", 
   "schlampe", 
   "schlong", 
   "schmuck", 
   "screw", 
   "screwing", 
   "scrotum", 
   "semen", 
   "sex", 
   "sexy", 
   "sh!+", 
   "sh!t", 
   "sh1t", 
   "sh1ter", 
   "sh1ts", 
   "sh1tter", 
   "sh1tz", 
   "sharmuta", 
   "sharmute", 
   "shemale", 
   "shi+", 
   "shipal", 
   "shit", 
   "shits", 
   "shitter", 
   "shitty", 
   "shity", 
   "shitz", 
   "shiz", 
   "shyt", 
   "shyte", 
   "shytty", 
   "shyty", 
   "skanck", 
   "skank", 
   "skankee", 
   "skankey", 
   "skanks", 
   "skanky", 
   "skribz", 
   "skurwysyn", 
   "slut", 
   "sluts", 
   "slutty", 
   "slutz", 
   "smut", 
   "son-of-a-bitch", 
   "sphencter", 
   "spic", 
   "spierdalaj", 
   "splooge", 
   "suka", 
   "teets", 
   "teez", 
   "testical", 
   "testicle", 
   "tits", 
   "titt", 
   "turd", 
   "twat", 
   "va1jina", 
   "vag1na", 
   "vagiina", 
   "vagina", 
   "vaj1na", 
   "vajina", 
   "vittu", 
   "vullva", 
   "vulva", 
   "w00se", 
   "wank", 
   "wetback", 
   "wh00r", 
   "wh0re", 
   "whoar", 
   "whore", 
   "wichser", 
   "xrated", 
   "zabourah" 
];



// Because both sets contained words that the other did not, we decided to merge both
// together with duplicates removed  . 
const merged = words.concat(profanities.filter((item) => words.indexOf(item) < 0));

// we changed the variables to match our merged list.
export const regexProfanities = merged.map((profanity) => {
    const normalizedProfanity = _.escapeRegExp(profanity.toLowerCase());
    return `${normalizedProfanity}.*`;
  });
  
