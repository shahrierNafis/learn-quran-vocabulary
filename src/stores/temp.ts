import {
  Card,
  createEmptyCard,
  generatorParameters,
  FSRS,
  RecordLog,
  Rating,
  formatDate,
} from "ts-fsrs";

let card: Card = createEmptyCard();
const f: FSRS = new FSRS(generatorParameters()); // or const f: FSRS = fsrs(params);
let scheduling_cards: RecordLog = f.repeat(card, new Date());
console.log(scheduling_cards[1]);
