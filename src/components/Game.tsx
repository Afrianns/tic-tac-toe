import "../assets/styles/Game.css";
import { useRef, useState } from "react";

import { activeCardType, ScoreType, selectedPointType } from "../types/type";

import Card from "./Card";
import Button from "./Button";
import Bot from "./Bot";

import MenuInGame from "./MenuInGame";
import ButtonListGame from "../utils/ButtonListGame";
interface propsType {
  transitionMenuR: () => void;
  solo: boolean;
  bot: boolean;
  playerMarker: boolean;
  roundTotal: number;
}

const winnnerPattern = ["123", "456", "789", "147", "258", "369", "159", "357"];

const initialBoard = {
  1: { type: "", win: false, active: false },
  2: { type: "", win: false, active: false },
  3: { type: "", win: false, active: false },
  4: { type: "", win: false, active: false },
  5: { type: "", win: false, active: false },
  6: { type: "", win: false, active: false },
  7: { type: "", win: false, active: false },
  8: { type: "", win: false, active: false },
  9: { type: "", win: false, active: false },
};
const initialScore = {
  playerOneWin: 0,
  playerTwoWin: 0,
  tie: 0,
};

export default function Game({
  solo,
  bot,
  transitionMenuR,
  playerMarker,
  roundTotal,
}: propsType) {
  const player = useRef(playerMarker ? "cross" : "circle");
  const [roundCount, setRoundCount] = useState(1);

  const BotPlayFirst = useRef(false);

  const [pointActive, setPointActive] = useState(player.current);
  const [active, setActive] = useState<activeCardType>(initialBoard);
  const [selectedPoint, setSelectedPoint] = useState<selectedPointType>({
    cross: [],
    circle: [],
  });
  const [score, setScore] = useState<ScoreType>(initialScore);

  const nextPoint = useRef("circle");
  const [pointWin, setPointWin] = useState("");
  const Turn = useRef(false);
  let isSavedScore = useRef(false);
  const isOver = useRef(false);
  const [showGameMenu, setShowGameMenu] = useState(false);

  const board = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  // nextPoint.current = pointActive;

  // console.log(player.current, playerMarker, pointActive);
  let spaceOccupied =
    selectedPoint["cross"].concat(selectedPoint["circle"]).length === 9;
  // set status
  const funcStatus = () => {
    return pointWin
      ? `${pointWin.toUpperCase()} WIN`
      : `${pointActive.toUpperCase()} TURN`;
  };
  const funcRound = () => {
    return `ROUND ${roundCount}`;
  };

  const BotRunning = () => {
    setTimeout(() => {
      Bot(
        active,
        setActive,
        selectedPoint,
        setSelectedPoint,
        setPointActive,
        player.current,
        nextPoint
      );
    }, 1000);
    Turn.current = false;
  };

  if (Turn.current && bot && !solo) {
    BotRunning();
  }

  if (bot && player.current === "cross" && !BotPlayFirst.current) {
    BotRunning();
    BotPlayFirst.current = true;
  }

  const updateScore = (type: string) => {
    setScore({
      ...score,
      [type]: score[type as keyof ScoreType] + 1,
    });
    isOver.current = true;
    isSavedScore.current = true;
  };

  // show menu in game
  const gameMenu = () => {
    setShowGameMenu(true);
  };

  // get the winner, if there is any winner
  if (pointWin && !isSavedScore.current) {
    gameMenu();
    if (pointWin === player.current) {
      updateScore("playerOneWin");
    } else {
      updateScore("playerTwoWin");
    }
  }

  // check if ties
  // check if there are no space left in boards, which mean game round is over
  if (spaceOccupied && !isSavedScore.current) {
    gameMenu();
    updateScore("tie");
  }

  // set winner card style
  const getTheWinner = (regexp: RegExp, point: string) => {
    winnnerPattern.forEach((pattern: string) => {
      const result = pattern.match(regexp);
      if (result && result.length >= 3) {
        setPointWin(point);
        setActive({
          ...active,
          [result[0]]: {
            ...active[result[0] as unknown as number],
            win: true,
          },
          [result[1]]: {
            ...active[result[1] as unknown as number],
            win: true,
          },
          [result[2]]: {
            ...active[result[2] as unknown as number],
            win: true,
          },
        });
      }
    });
  };

  if (!pointWin) {
    getTheWinner(
      new RegExp(`[${selectedPoint["cross"].join("")}]`, "g"),
      "cross"
    );
    getTheWinner(
      new RegExp(`[${selectedPoint["circle"].join("")}]`, "g"),
      "circle"
    );
  }

  const setResetValue = () => {
    setPointWin("");
    setPointActive(player.current);
    setScore({
      playerOneWin: 0,
      playerTwoWin: 0,
      tie: 0,
    });

    setActive(initialBoard);
    setSelectedPoint({
      cross: [],
      circle: [],
    });
    setRoundCount(1);
    isSavedScore.current = false;
    BotPlayFirst.current = false;
    nextPoint.current = "circle";
  };

  const setNextRound = () => {
    setPointWin("");
    setPointActive(player.current);

    setActive(initialBoard);
    setSelectedPoint({
      cross: [],
      circle: [],
    });

    setRoundCount(roundCount + 1);
    isSavedScore.current = false;
    BotPlayFirst.current = false;
    nextPoint.current = "circle";
  };

  const setMenu = () => {
    transitionMenuR();
  };

  // props to card component
  const propsCard = {
    setPointActive: setPointActive,
    nextPoint: nextPoint,
    active: active,
    setActive: setActive,
    selectedPoint: selectedPoint,
    setSelectedPoint: setSelectedPoint,
    Turn: Turn,
    player: player.current,
    bot: bot,
  };

  const propsMenuGame = {
    winner: pointWin,
    roundCount: roundCount,
    showGameMenu: showGameMenu,
    spaceOccupied: spaceOccupied,
    setGameMenu: setShowGameMenu,
    setResetValue: setResetValue,
    setNextRound: setNextRound,
    setMenu: setMenu,
    round: roundTotal,
    player: player.current,
  };

  return (
    <>
      {showGameMenu && <MenuInGame {...propsMenuGame} />}
      <div className="info-menu">
        <Button button={ButtonListGame({ funcStatus, funcRound, score })[0]} />
        <div onClick={gameMenu}>
          <Button
            button={ButtonListGame({ funcStatus, funcRound, score })[1]}
          />
        </div>
        <Button button={ButtonListGame({ funcStatus, funcRound, score })[2]} />
      </div>
      {board.map((col, index) => {
        return (
          <div key={index} className="card-board-wrapper">
            {col.map((row: number) => {
              return <Card key={row} row={row} {...propsCard} />;
            })}
          </div>
        );
      })}
      <div className="info-menu">
        {[3, 4, 5].map((index: number) => {
          return (
            <Button
              key={index}
              button={ButtonListGame({ funcStatus, funcRound, score })[index]}
            />
          );
        })}
      </div>
    </>
  );
}
