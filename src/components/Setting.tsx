import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Button from "./Button";

import CircleActive from "../assets/points/active/circle.svg?react";
import CrossActive from "../assets/points/active/cross.svg?react";

interface propsType {
  hideSetting: (n: boolean) => void;
  playerMarker: boolean;
  setPlayerMarker: (n: boolean) => void;
  roundTotal: number;
  setRoundTotal: (n: number) => void;
}

export default function Setting({
  playerMarker,
  roundTotal,
  hideSetting,
  setPlayerMarker,
  setRoundTotal,
}: propsType) {
  useGSAP(() => {
    gsap.from(".setting", {
      y: "100%",
      duration: 1,
      ease: "elastic.inOut",
    });

    if (playerMarker) {
      gsap.to(".toggle", {
        x: "1.88rem",
      });
    } else {
      gsap.to(".toggle", {
        x: "-1.88rem",
      });
    }
  });

  const hide = () => {
    gsap.to(".setting", {
      y: "100%",
      duration: 0.8,
      ease: "expo.inOut",
      onComplete() {
        hideSetting(false);
      },
    });
  };

  const toggle = () => {
    if (!playerMarker) {
      gsap.to(".toggle", {
        x: "1.88rem",
        duration: 0.5,
        ease: "expo.inOut",
        onComplete() {
          setPlayerMarker(true);
        },
      });
    } else {
      gsap.to(".toggle", {
        x: "-1.88rem",
        duration: 0.5,
        ease: "expo.inOut",
        onComplete() {
          setPlayerMarker(false);
        },
      });
    }
  };

  const increase = () => {
    if (roundTotal >= 6) return;
    setRoundTotal(roundTotal + 1);
  };

  const decrease = () => {
    if (roundTotal <= 2) return;
    setRoundTotal(roundTotal - 1);
  };

  const button = [
    {
      ind: 14,
      name: "SAVE",
      fore_color: "var(--light-green)",
      back_color: "var(--dark-green)",
      hover: true,
      font_size: "1.5rem",
    },
    {
      ind: 15,
      name: "DONE",
      fore_color: "var(--info-color)",
      back_color: "var(--info-color-dark)",
      hover: true,
      font_size: "1.5rem",
    },
  ];

  return (
    <>
      <div className="setting">
        <div className="popup-button-wrapper">
          <Button button={button[0]} />
          <div onClick={hide}>
            <Button button={button[1]} />
          </div>
        </div>
        <div className="setting-content">
          <section className="setting-item">
            <p>Player One (P1) Marker Type*</p>
            <div className="setting-item-icon" onClick={toggle}>
              <span className="toggle"></span>
              <CrossActive width={20} height={20} fill="var(--cross-color)" />
              <CircleActive width={20} height={20} fill="var(--circle-color)" />
            </div>
          </section>
          <p>
            <strong>(*)</strong> O always be the first to move.
          </p>
          <p>
            <strong>(*)</strong> P2 will be opposide P1 picked
          </p>
          <section className="setting-item">
            <p>Total Round</p>
            <div className="setting-item-icon">
              {roundTotal > 2 ? (
                <span className="decrease" onClick={decrease}>
                  -
                </span>
              ) : (
                <span className="inc-dec-placeholder"></span>
              )}
              <span className="round-total">{roundTotal}</span>

              {roundTotal < 6 ? (
                <span className="increase" onClick={increase}>
                  +
                </span>
              ) : (
                <span className="inc-dec-placeholder"></span>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
