import { AsyncStorage } from 'react-native';
import {FLASHCARDS_STORAGE_KEY} from "./constants";
import {generateDeckUID} from "./helpers";

// notice I have empty callbacks for the last arguments in getItem and setItem. This is because
// the linter was driving me insane with yellow squiggly lines and I hated it and it made me want to rage.

// dummy data for app:
// https://esqsoft.com/javascript_examples/date-to-epoch.htm  <-- to get date epochs for dummy data

function initialData () {
    return {
        'wghfvipdno0se3j0cw7h': {
            id: '18gcb3tzo2xi7mxdu9fh',
            title: 'React',
            questions: [
                {
                    question: 'What is React?',
                    answer: 'A library for managing user interfaces'
                },
                {
                    question: 'Where do you make Ajax requests in React?',
                    answer: 'The componentDidMount lifecycle event'
                }
            ],
            created: 1588793894
        },
        '18gcb3tzo2xi7mxdu9fh': {
            id: '18gcb3tzo2xi7mxdu9fh',
            title: 'JavaScript',
            questions: [
                {
                    question: 'What is a closure?',
                    answer: 'The combination of a function and the lexical environment within which that function was declared.'
                }
            ],
            created: 1588698610
        }
    }
}

export async function getDecks () {
    await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY, () => {})
        .then((decks) => {
            return JSON.parse(decks);
        })
        .catch((e) => {
            AsyncStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(initialData()), () => {})
                .then((results) => {
                    return JSON.parse(results);
                })
                .catch((e) => {
                    AsyncStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(initialData()), () => {})
                        .then((results) => {
                            return results;
                        })
                        .catch((e) => {
                            return `Unable to decks: ${e.message}`
                        });

                });
        });
}

export async function getDeck ({ id }) {
    return await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY, () => {})
        .then((decks) => {
        return JSON.parse(decks[id]);
    })
        .catch((e) => {
        return "There is no deck with this id.";
    })
}

export async function saveDeckTitle ({ title }) {
    const id = generateDeckUID();
    const deck = {
        id: id,
        title: title,
        questions: []
    };

    await AsyncStorage.mergeItem(FLASHCARDS_STORAGE_KEY, JSON.stringify({[id]: deck}), () => {});
    return deck;
}

export async function addCardToDeck ({ id, card }) {
    return await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY, () => {})
        .then((results) => {
            const data = JSON.parse(results);
            const deck = data[id];
            deck.questions = deck.questions.concat([card]);
            return AsyncStorage.mergeItem(FLASHCARDS_STORAGE_KEY, JSON.stringify({[id]: deck}), () => {});
        })
        .catch((e) => {
            return `Unable to add deck: ${e.message}`
        });
}

export async function deleteDeck({ deckId }) {
    return await AsyncStorage.getItem(FLASHCARDS_STORAGE_KEY, () => {})
        .then((results) => {
            const data = JSON.parse(results);
            delete data[deckId];

            AsyncStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(data), () => {});
        })
        .catch((e) => {
            return `Unable to delete deck: ${e.message}`
        });
}

