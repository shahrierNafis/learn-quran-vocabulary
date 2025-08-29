import { useOnlineStorage } from "@/stores/onlineStorage";
import { Card, createEmptyCard } from "ts-fsrs";

export default function getCount(wordList: { [key: string]: { card: Card; index: string; isSuspended: boolean } }) {
  let newWords = 0;
  let learning = 0;
  let review = 0;
  let relearning = 0;
  let studiedToday = 0;
  for (const [lemma, word] of Object.entries(wordList)) {
    if (word.isSuspended) {
      continue;
    }
    if (!word.card.due) {
      useOnlineStorage.getState().updateCard(lemma, createEmptyCard());
    }
    if (word.card.last_review && word.card.last_review.toDateString() === new Date().toDateString()) studiedToday++;
    switch (word.card.state) {
      case 0:
        newWords++;
        break;
      case 1:
        learning++;
        break;
      case 2:
        if (word.card.due.toDateString() === new Date().toDateString()) review++;
        break;
      case 3:
        relearning++;
        break;
    }
  }
  return { newWords, learning, review, relearning, studiedToday };
}
