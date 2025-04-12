import { useEffect, useState } from "react";
import "./App.css";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Button from "./utils/Button";
import Game from "./components/game/Game";
import Setting from "./components/Setting";

import { buttonsMenuInGame } from "./utils/ButtonListMenu";
import Notification from "./utils/Notification";

export default function App() {
  const [soloGame, setSoloGame] = useState(false);
  const [botGame, setBotGame] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  const [playerMarker, setPlayerMarker] = useState(false);
  const [roundTotal, setRoundTotal] = useState(2);
  const [showNotif, setShowNotif] = useState(false);

  const LSData = localStorage.getItem("setting-data");

  useEffect(() => {
    if (LSData) {
      setRoundTotal(JSON.parse(LSData).roundTotal);
      setPlayerMarker(JSON.parse(LSData).playerMarker);
    }
  }, []);

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

  const showNotification = () => {
    setShowNotif(true);
    // setTimeout(() => {
    //   setShowNotif(false);
    // }, 5000);
  };

  const transitionBackToGame = () => {
    gsap.to(".game-menu-wrapper", {
      height: "100%",
      duration: 1,
      ease: "expo.inOut",
      clearProps: "all",
      onComplete() {
        setSoloGame(false);
        setBotGame(false);
      },
    });
  };

  const transitionToGame = () => {
    gsap.to(".game-menu-wrapper", {
      height: 0,
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
    showNotification: showNotification,
  };

  return (
    <div>
      {(soloGame || botGame) && <Game {...gameProps} />}
      <div className="game-menu-wrapper">
        {showNotif && <Notification setShowNotif={setShowNotif} />}
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
