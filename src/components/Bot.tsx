import { activeCardType, selectedPointType } from "../types/type";

const winnnerPattern = ["123", "456", "789", "147", "258", "369", "159", "357"];
const edges = ["1", "3", "7", "9"];

type nestedArrayType = number[];
type possibleBlockPatternType = {
  [index: number]: number;
};

type duplicateType = {
  digit: string;
  duplicate: number;
};

export default function Bot(
  active: activeCardType,
  setActive: (a: activeCardType) => void,
  selectedPoint: selectedPointType,
  setSelectedPoint: (a: selectedPointType) => void,
  setPointActive: (a: string) => void,
  player: string
) {
  const playerOne = player;
  const playerBot = player === "cross" ? "circle" : "cross";

  const playerOneMark = playerOne == "circle" ? "o" : "x";
  const playerBotMark = playerBot == "circle" ? "o" : "x";
  // const playerOne = "circle";
  // const playerBot = "cross";

  // const playerOneMark = "o";
  // const playerBotMark = "x";

  let enemyPossibleWinPattern: string[] = [];
  let selfPossibleWinPattern: string[] = [];

  let enemyClosedtoWinPattern: string[] = [];
  let selfClosedtoWinPattern: string[] = [];

  let enemySteps: string[] = [];
  let selfSteps: string[] = [];

  // point = marker that either player or bot chosed

  // find the enemy point closest to win
  // if point equal then check if enemy have more than 1 point to win
  // if there isn't then prioritized to win
  // prevent combination connect  (1)2 3(selected) - (1)4 7(selected)

  // enemy = cross
  // self = circle

  const assignSubtituteXO = (
    possibleWinPattern: string[],
    steps: string[],
    type: string,
    count: number
  ) => {
    if (count >= 2) {
      return possibleWinPattern;
    } else {
      let subtituteXO: string[] = [];
      possibleWinPattern.forEach((pattern: string) => {
        let subtitute = new RegExp(`[${steps.join(" ")}]`, "g");
        subtituteXO.push(pattern.replace(subtitute, type));
      });

      if (type === playerOneMark) {
        return assignSubtituteXO(
          subtituteXO,
          selfSteps,
          playerBotMark,
          ++count
        );
      } else {
        return assignSubtituteXO(
          subtituteXO,
          enemySteps,
          playerOneMark,
          ++count
        );
      }
    }
  };

  // get position that closest to winning pattern
  const checkMatchToWinPattern = (n: number, type: string) => {
    let currentChosed: string = "";
    let possibleWinPattern: string[] = [];

    winnnerPattern.forEach((pattern: string) => {
      if (active[n].type === type) {
        const result = pattern.match(new RegExp(`[${n}]`, "g"));

        if (result) {
          possibleWinPattern.push(pattern);
          currentChosed = result.toString();
        }
      }
    });

    if (type === playerOne) {
      enemySteps.push(currentChosed);
    } else {
      selfSteps.push(currentChosed);
    }
    return possibleWinPattern;
  };

  const startBot = () => {
    if (
      selectedPoint[playerOne].concat(selectedPoint[playerBot]).length === 9
    ) {
      return;
    }
    // get enemy position

    selectedPoint[playerOne].forEach((selected: number) => {
      enemyPossibleWinPattern = enemyPossibleWinPattern.concat(
        checkMatchToWinPattern(selected, playerOne)
      );
    });

    selectedPoint[playerBot].forEach((selected: number) => {
      selfPossibleWinPattern = selfPossibleWinPattern.concat(
        checkMatchToWinPattern(selected, playerBot)
      );
    });

    // subtitute every step on every possible pattern to win
    const Enemy = assignSubtituteXO(
      enemyPossibleWinPattern,
      enemySteps,
      playerOneMark,
      0
    );
    const Bot = assignSubtituteXO(
      selfPossibleWinPattern,
      selfSteps,
      playerBotMark,
      0
    );

    enemyClosedtoWinPattern = Enemy;
    selfClosedtoWinPattern = Bot;

    // check if only need one more to win
    // check itself first
    const posSelf = checkIfNeedOneMoreToWin(
      selfClosedtoWinPattern,
      playerBotMark
    );

    if (posSelf !== null) {
      return checklistBoard(posSelf);
    }

    // if enemy pick either middle or edges then do the following
    // if enemy first pick middle, the only possible to "win" is to pick edges(every edge)
    // if enemy first pick edge, the only possible to "win" is to pick middle

    if (enemySteps.length == 1 && selfSteps.length < 1) {
      // if enemy position is in edges then pick middle position/checklist position
      if (edges.indexOf(enemySteps[0]) !== -1) {
        return checklistBoard("5");
      }

      // either put this logic here or in line 334 or in if statement when there are no duplicate
      if (enemySteps[0] === "5") {
        return checklistBoard(edges[Math.floor(Math.random() * edges.length)]);
      }
    }

    // else check enemy need one more to win
    const posEnemy = checkIfNeedOneMoreToWin(
      enemyClosedtoWinPattern,
      playerOneMark
    );

    // if yes then checklist position to blockade enemy to win
    if (posEnemy !== null) {
      return checklistBoard(posEnemy);
    }

    if (
      enemyClosedtoWinPattern.length < 1 &&
      selfClosedtoWinPattern.length < 1
    ) {
      // if the bot do first then pick random
      const randomPattern =
        winnnerPattern[Math.floor(Math.random() * winnnerPattern.length)];

      checklistBoard(randomPattern[Math.floor(Math.random() * 3)]);
    } else {
      // if not then find effective combination for itself according to enemy move before
      selfCheckPosition();
    }
  };

  // check if enemy left 1 position coordinates
  const checkIfNeedOneMoreToWin = (pattern: string[], type: string) => {
    for (const digit of pattern) {
      const newDigit = digit.replace(new RegExp(`[${type}]`, "g"), "");
      if (newDigit.length <= 1 && newDigit !== "x" && newDigit !== "o") {
        return newDigit;
      }
    }
    return null;
  };

  // checklist according to position coordinate
  const checklistBoard = (pos: string) => {
    console.log("get Called", pos, selfSteps, enemySteps);
    setActive({
      ...active,
      [pos]: { type: playerBot, win: false, active: true },
    });

    setSelectedPoint({
      ...selectedPoint,
      [playerBot]: [...selectedPoint[playerBot], Number.parseInt(pos)],
    });
    setPointActive(playerOne);
    selfSteps.push(pos);
  };

  const selfCheckPosition = () => {
    let matchPattern: nestedArrayType[] = [];
    let possibleBlockPattern: possibleBlockPatternType[] = [];
    let result: number[] = [];

    let selectedPatternArray: string[] = [];

    let possibleDigitPatternArray = new Set();
    let duplicate: duplicateType[] = [];
    let totalDuplicateDigit = 0;

    // search single winnerPattern that occur multiple times on enemyClosedtoWinPattern
    // and get those index with total number of digit occur in single pattern of winnnerPattern
    winnnerPattern.forEach((pos: string) => {
      let subMatchPattern: number[] = [];

      for (const pattern of enemyClosedtoWinPattern) {
        const patternWithoutXO = pattern.match(/[^xo]/g);
        let num = 0;

        if (patternWithoutXO !== null) {
          patternWithoutXO.forEach((digit: string) => {
            if (pos.split("").indexOf(digit) !== -1) {
              num++;
            }
          });
        }
        if (num !== 0) subMatchPattern.push(num);
      }
      matchPattern.push(subMatchPattern);
    });

    // get maximum length in matchPattern array
    let initialLength = Math.max(...matchPattern.map((a) => a.length));

    // convert matchPattern to total pattern that has same as initialLength
    // search "matchPattern" that length and total of duplicate occurs more than the other
    // if not then push pattern than has same length
    matchPattern.forEach((patterns: number[], index: number) => {
      if (patterns.length === initialLength) {
        let total = patterns.reduce((a, b) => a + b);
        possibleBlockPattern.push({ [index]: total });
        if (total > totalDuplicateDigit) totalDuplicateDigit = total;
      }
    });

    // get all index that has same total as totalDuplicateDigit and push to result
    possibleBlockPattern.forEach((position: possibleBlockPatternType) => {
      let index = Object.keys(position)[0] as unknown as number;
      if (position[index] > totalDuplicateDigit) result.push(index);
      if (position[index] === totalDuplicateDigit) result.push(index);
    });

    for (const index of result) {
      selectedPatternArray.push(winnnerPattern[index]);
    }

    for (const selectedPattern of selectedPatternArray) {
      enemyClosedtoWinPattern.forEach((pattern: string) => {
        let matchDigit = pattern.match(new RegExp(`[${selectedPattern}]`, "g"));
        if (matchDigit != null && matchDigit.length <= 1) {
          possibleDigitPatternArray.add(matchDigit.join(""));
        }
      });
    }

    // find pattern in enemyClosedtoWinPattern that same as possibleDigitPatternArray
    // if there are more than 1 pattern in enemyClosedtoWinPattern that has 1 digit possibleDigitPatternArray
    // push it to duplicate
    for (const digit of possibleDigitPatternArray) {
      let count = 0;
      for (const pattern of enemyClosedtoWinPattern) {
        if (
          pattern.includes(digit as string) &&
          !pattern.includes(playerBotMark)
        ) {
          count++;
        }
      }
      if (count > 1) {
        duplicate.push({
          digit: digit as string,
          duplicate: count,
        });
      }
    }

    // check possible to win with previous position
    let selfPossibleToWin = selfClosedtoWinPattern.filter((pattern: string) => {
      return (
        pattern.includes(playerBotMark) && !pattern.includes(playerOneMark)
      );
    });

    if (selfPossibleToWin.length <= 0) {
      console.log(
        "first step ",
        duplicate,
        selfPossibleToWin,
        possibleDigitPatternArray
      );
      return checklistBoard(
        [...possibleDigitPatternArray][
          Math.floor(Math.random() * possibleDigitPatternArray.size)
        ] as unknown as string
      );
    }

    if (duplicate.length <= 0) {
      let selectedDigitList: string[] = [];
      let longest = 0;
      for (const digit of possibleDigitPatternArray) {
        let count = 0;
        for (const pattern of selfPossibleToWin) {
          if (pattern.includes(digit as string)) {
            count++;
          }
        }
        if (count > longest) {
          selectedDigitList.push(digit as string);
          longest = count;
        }
      }
      console.log("first step duplicate ", selectedDigitList, duplicate);

      if (selectedDigitList.length > 0) {
        checklistBoard(
          selectedDigitList[
            Math.floor(Math.random() * selectedDigitList.length)
          ]
        );
      } else {
        pickRandomDigitInPattern(
          selfPossibleToWin[
            Math.floor(Math.random() * selfPossibleToWin.length)
          ]
        );
      }
    }

    if (duplicate.length == 1) {
      console.log("second step duplicate ", duplicate, selfPossibleToWin);
      let selectedDigit = "";
      for (const pattern of selfPossibleToWin) {
        if (pattern.includes(duplicate[0].digit)) {
          selectedDigit = duplicate[0].digit;
        }
      }

      if (selectedDigit) {
        checklistBoard(selectedDigit);
      } else {
        pickRandomDigitInPattern(
          selfPossibleToWin[
            Math.floor(Math.random() * selfPossibleToWin.length)
          ]
        );
      }
    }

    if (duplicate.length > 1) {
      console.log("third step duplicate ", duplicate, selfPossibleToWin);
      let selectedPattern: any[] = [];
      for (const pattern of selfPossibleToWin) {
        let count = 0;
        let fdigit = null;
        for (const digit of possibleDigitPatternArray) {
          if (pattern.includes(digit as string)) {
            count++;
            fdigit = digit;
          }
        }

        if (count <= 1) {
          selectedPattern.push({
            digit: fdigit,
            pattern: pattern,
          });
        }
      }

      let resultDigit = selectedPattern
        .map((item) => {
          if (item.digit != null) return item.digit;
        })
        .filter((item) => item !== undefined);
      let resultPattern = selectedPattern
        .map((item) => {
          if (item.digit == null) return item.pattern;
        })
        .filter((item) => item !== undefined);

      if (resultDigit.length > 0) {
        checklistBoard(
          resultDigit[Math.floor(Math.random() * resultDigit.length)]
        );
      } else {
        pickRandomDigitInPattern(
          resultPattern[Math.floor(Math.random() * resultPattern.length)]
        );
      }
    }
  };

  const pickRandomDigitInPattern = (pattern: string) => {
    let result = pattern.split("").find((digit) => digit !== playerBotMark);
    if (result) return checklistBoard(result);
  };

  startBot();
}
