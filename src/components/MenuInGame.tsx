import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import Button from "./Button";

import { buttonsMenuInGame } from "../utils/ButtonListMenu";
import { ScoreType } from "../types/type";

gsap.registerPlugin(useGSAP);

interface propsType {
  winner: String;
  showGameMenu: boolean;
  spaceOccupied: boolean;
  roundCount: number;
  setGameMenu: (n: boolean) => void;
  setResetValue: () => void;
  setNextRound: () => void;
  setMenu: () => void;
  round: number;
  score: ScoreType;
  player: string;
}

export default function MenuInGame({
  winner,
  showGameMenu,
  spaceOccupied,
  roundCount,
  setGameMenu,
  setResetValue,
  setNextRound,
  setMenu,
  round,
  score,
  player,
}: propsType) {
  const container = useRef<HTMLDivElement>(null);

  let info = "";

  useGSAP(
    () => {
      gsap.from(".backdrop-menu", {
        opacity: 0,
        duration: 1,
      });

      gsap.to(".back-color", {
        width: "100%",
        duration: 1,
        ease: "expo.inOut",
      });
    },
    { scope: container, dependencies: [showGameMenu] }
  );

  const getWhoWinner = () => {
    if (score.tie > score.playerOneWin && score.tie > score.playerTwoWin) {
      return "GAME OVER WITH TIE";
    } else if (score.playerOneWin > score.playerTwoWin) {
      return `PLAYER ONE (${player}) ARE THE WINNER`;
    } else if (score.playerTwoWin > score.playerOneWin) {
      return `PLAYER TWO (${
        player === "cross" ? "circle" : "cross"
      }) ARE THE WINNER`;
    } else {
      return "GAME OVER WITH TIE";
    }
  };

  if (
    (winner && roundCount >= round) ||
    (spaceOccupied && roundCount >= round)
  ) {
    info += `${getWhoWinner()}`;
  } else {
    if (winner) {
      info += `${winner} WIN #${roundCount}`;
    } else if (spaceOccupied) {
      info += `GAME TIE #${roundCount}`;
    } else {
      info += `GAME PUASE #${roundCount}`;
    }
  }

  const resume = () => {
    gsap.to(".back-color", {
      width: "0%",
      duration: 1,
      ease: "expo.inOut",
    });

    gsap.to(".backdrop-menu", {
      opacity: 0,
      duration: 1,
      ease: "expo.inOut",
      onComplete() {
        setGameMenu(false);
      },
    });
  };

  const restart = () => {
    setTimeout(() => {
      setResetValue();
    }, 500);
    resume();
  };

  const nextRound = () => {
    setTimeout(() => {
      setNextRound();
    }, 500);
    resume();
  };

  const menu = () => {
    setMenu();
  };

  return (
    <div ref={container}>
      <div className="backdrop-menu">
        <div className="back-color">
          <div className="menu-wrapper">
            <h1>{info}</h1>

            <div className="menu-list">
              <div onClick={() => menu()}>
                <Button button={buttonsMenuInGame[0]} />
              </div>
              <div onClick={() => restart()}>
                <Button button={buttonsMenuInGame[1]} />
              </div>

              {(winner && roundCount < round) ||
              (spaceOccupied && roundCount < round) ? (
                <div onClick={() => nextRound()}>
                  <Button button={buttonsMenuInGame[3]} />
                </div>
              ) : null}

              {roundCount <= round && !winner && !spaceOccupied && (
                <div onClick={() => resume()}>
                  <Button button={buttonsMenuInGame[2]} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
