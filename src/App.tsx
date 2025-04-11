import { useState } from "react";
import "./App.css";
import gsap from "gsap";
import Button from "./components/Button";
import Game from "./components/Game";
import Setting from "./components/Setting";
import { buttonsMenuInGame } from "./utils/ButtonListMenu";
import { useGSAP } from "@gsap/react";

export default function App() {
  const [soloGame, setSoloGame] = useState(false);
  const [botGame, setBotGame] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  const [playerMarker, setPlayerMarker] = useState(false);
  const [roundTotal, setRoundTotal] = useState(2);

  const playGameSolo = () => {
    setSoloGame(true);
    transitionToGame();
  };

  const playGameBot = () => {
    setBotGame(true);
    transitionToGame();
  };

  const setting = () => {
    setShowSetting(true);
  };

  const transitionBackToGame = () => {
    let data = gsap.to(".game-menu-wrapper", {
      y: 0,
      duration: 1,
      ease: "expo.inOut",
      clearProps: "all",
      onComplete() {
        setSoloGame(false);
        setBotGame(false);
        data.kill();
      },
    });
  };

  const transitionToGame = () => {
    gsap.to(".game-menu-wrapper", {
      y: "-100%",
      duration: 1,
      ease: "expo.inOut",
    });
  };

  useGSAP(() => {
    gsap.to(".game-menu-wrapper", {
      duration: 5,
      backgroundColor: "#16584c",
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    tl.to(".title", { color: "#1ca94b", duration: 3 });
    tl.to(".title", { color: "#139018", duration: 4 });
    tl.to(".title", { color: "#1ea655", duration: 5 });
  });

  const gameProps = {
    playerMarker: playerMarker,
    roundTotal: roundTotal,
    solo: soloGame,
    bot: botGame,
    transitionMenuR: transitionBackToGame,
  };

  const settingProps = {
    hideSetting: setShowSetting,
    playerMarker: playerMarker,
    setPlayerMarker: setPlayerMarker,
    roundTotal: roundTotal,
    setRoundTotal: setRoundTotal,
  };

  return (
    <div>
      {(soloGame || botGame) && <Game {...gameProps} />}
      <div className="game-menu-wrapper">
        <div className="game-menu">
          <h1>
            {" "}
            <span className="title">Tic Tac Toe </span>Game
          </h1>
          <div className="container-menu">
            <div onClick={playGameSolo}>
              <Button button={buttonsMenuInGame[4]} />
            </div>
            <div onClick={playGameBot}>
              <Button button={buttonsMenuInGame[5]} />
            </div>
            <div onClick={setting}>
              <Button button={buttonsMenuInGame[6]} />
            </div>
          </div>
        </div>
        {showSetting && <Setting {...settingProps} />}
      </div>
    </div>
  );
}
