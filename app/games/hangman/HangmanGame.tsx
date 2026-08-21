"use client";

import { useState } from "react";

type HangmanVoc = {
  id: number;
  wort: string;
  uebersetzung: string | null;
  chapter: string | null;
};

type HangmanGameProps = {
  vocs: HangmanVoc[];
  initialVoc: HangmanVoc;
};

const keyboardRows = [
  ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä"],
  ["y", "x", "c", "v", "b", "n", "m", "ß"],
];

const MAX_WRONG_LETTERS = 6;

export default function HangmanGame({ vocs, initialVoc }: HangmanGameProps) {
  const [selectedGroup, setSelectedGroup] = useState(initialVoc.chapter ?? "");

  const [currentVoc, setCurrentVoc] = useState<HangmanVoc>(initialVoc);

  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

  const groups = [...new Set(vocs.map((voc) => voc.chapter).filter((chapter): chapter is string => Boolean(chapter)))];

  const word = currentVoc.wort.trim();

  const normalizedWord = word.toLocaleLowerCase("de-DE");

  const wrongLetters = selectedLetters.filter((letter) => !normalizedWord.includes(letter));

  const hasLost = wrongLetters.length >= MAX_WRONG_LETTERS;

  const lettersInWord = Array.from(normalizedWord).filter((letter) => /[a-zäöüß]/i.test(letter));

  const hasWon = lettersInWord.length > 0 && lettersInWord.every((letter) => selectedLetters.includes(letter));

  const gameOver = hasWon || hasLost;

  function getWordsForGroup(group: string): HangmanVoc[] {
    return vocs.filter((voc) => voc.chapter === group);
  }

  function getRandomVoc(possibleVocs: HangmanVoc[], excludeId?: number): HangmanVoc | null {
    if (possibleVocs.length === 0) {
      return null;
    }

    let selectableVocs = possibleVocs;

    // Wenn möglich, nicht direkt dasselbe Wort noch einmal wählen.
    if (excludeId !== undefined && possibleVocs.length > 1) {
      selectableVocs = possibleVocs.filter((voc) => voc.id !== excludeId);
    }

    const randomIndex = Math.floor(Math.random() * selectableVocs.length);

    return selectableVocs[randomIndex];
  }

  function startNewGame(group: string = selectedGroup) {
    const possibleVocs = getWordsForGroup(group);

    const newVoc = getRandomVoc(possibleVocs, currentVoc.id);

    if (!newVoc) {
      return;
    }

    setSelectedLetters([]);
    setCurrentVoc(newVoc);
  }

  function handleGroupChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newGroup = event.target.value;

    setSelectedGroup(newGroup);

    const possibleVocs = getWordsForGroup(newGroup);

    const newVoc = getRandomVoc(possibleVocs);

    if (!newVoc) {
      return;
    }

    setSelectedLetters([]);
    setCurrentVoc(newVoc);
  }

  function handleLetterClick(letter: string) {
    if (gameOver) {
      return;
    }

    if (selectedLetters.includes(letter)) {
      return;
    }

    setSelectedLetters((previous) => [...previous, letter]);
  }

  function isLetterVisible(letter: string) {
    const normalizedLetter = letter.toLocaleLowerCase("de-DE");

    return selectedLetters.includes(normalizedLetter) || hasLost;
  }

  return (
    <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
      {/* Gruppenauswahl */}
      <div className="mb-6">
        <label htmlFor="hangman-group" className="mb-2 block text-sm font-medium">
          Wortgruppe
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <select
            id="hangman-group"
            value={selectedGroup}
            onChange={handleGroupChange}
            className="
              rounded-md
              border
              bg-background
              px-3
              py-2
            "
          >
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <span className="text-sm text-muted-foreground">{getWordsForGroup(selectedGroup).length} Wörter</span>
        </div>
      </div>

      {/* Überschrift */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold">Hangman</h2>

        <p className="mt-1 text-sm text-muted-foreground">Gruppe: {selectedGroup}</p>
      </div>

      {/* Galgen */}
      <div className="flex justify-center">
        <svg width="220" height="250" viewBox="0 0 220 250" className="stroke-foreground">
          {/* Galgen */}
          <line x1="50" y1="230" x2="170" y2="230" strokeWidth="4" />

          <line x1="80" y1="230" x2="80" y2="20" strokeWidth="4" />

          <line x1="80" y1="20" x2="160" y2="20" strokeWidth="4" />

          <line x1="160" y1="20" x2="160" y2="50" strokeWidth="4" />

          {/* Kopf */}
          {wrongLetters.length >= 1 && <circle cx="160" cy="70" r="20" fill="none" strokeWidth="4" />}

          {/* Körper */}
          {wrongLetters.length >= 2 && <line x1="160" y1="90" x2="160" y2="150" strokeWidth="4" />}

          {/* linker Arm */}
          {wrongLetters.length >= 3 && <line x1="160" y1="110" x2="130" y2="130" strokeWidth="4" />}

          {/* rechter Arm */}
          {wrongLetters.length >= 4 && <line x1="160" y1="110" x2="190" y2="130" strokeWidth="4" />}

          {/* linkes Bein */}
          {wrongLetters.length >= 5 && <line x1="160" y1="150" x2="135" y2="190" strokeWidth="4" />}

          {/* rechtes Bein */}
          {wrongLetters.length >= 6 && <line x1="160" y1="150" x2="185" y2="190" strokeWidth="4" />}
        </svg>
      </div>

      {/* Fehleranzeige */}
      <div className="mb-8 text-center">
        <p className="font-medium">
          Fehler: {wrongLetters.length} / {MAX_WRONG_LETTERS}
        </p>

        {wrongLetters.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Falsche Buchstaben: <span className="font-semibold text-foreground">{wrongLetters.map((letter) => letter.toUpperCase()).join(", ")}</span>
          </p>
        )}
      </div>

      {/* Gesuchtes Wort */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {Array.from(word).map((letter, index) => {
          const normalizedLetter = letter.toLocaleLowerCase("de-DE");

          const isSpecialCharacter = !/[a-zäöüß]/i.test(letter);

          const visible = isSpecialCharacter || isLetterVisible(normalizedLetter);

          return (
            <div
              key={`${letter}-${index}`}
              className="
                  flex
                  h-12
                  min-w-8
                  items-end
                  justify-center
                  border-b-2
                  border-foreground
                  px-1
                  text-2xl
                  font-semibold
                "
            >
              {visible ? letter : ""}
            </div>
          );
        })}
      </div>

      {/* Ergebnis */}
      {gameOver && (
        <div className="mb-8 rounded-lg border bg-muted p-4 text-center">
          {hasWon ? <h3 className="text-xl font-semibold">Gewonnen!</h3> : <h3 className="text-xl font-semibold">Leider verloren</h3>}

          <p className="mt-2">
            Das Wort war <span className="font-semibold">{word}</span>.
          </p>

          {currentVoc.uebersetzung && <p className="mt-2 text-muted-foreground">Übersetzung: {currentVoc.uebersetzung}</p>}

          <button
            type="button"
            onClick={() => startNewGame()}
            className="
              mt-4
              rounded-md
              border
              bg-background
              px-4
              py-2
              font-medium
              transition
              hover:bg-muted
            "
          >
            Neues Spiel
          </button>
        </div>
      )}

      {/* Tastatur */}
      <div className="space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {row.map((letter) => {
              const selected = selectedLetters.includes(letter);

              const wrong = selected && !normalizedWord.includes(letter);

              const correct = selected && normalizedWord.includes(letter);

              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleLetterClick(letter)}
                  disabled={selected || gameOver}
                  className={`
                      flex
                      h-10
                      w-9
                      items-center
                      justify-center
                      rounded-md
                      border
                      text-sm
                      font-medium
                      uppercase
                      transition
                      sm:h-11
                      sm:w-11

                      ${!selected ? "bg-background hover:bg-muted" : ""}

                      ${correct ? "border-green-600 bg-green-100 text-green-800" : ""}

                      ${wrong ? "border-red-600 bg-red-100 text-red-800" : ""}

                      disabled:cursor-default
                      disabled:opacity-70
                    `}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
