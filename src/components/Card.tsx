import type { activeCardType, selectedPointType } from "../types/type";

import CircleHover from "../assets/points/hover/circle.svg?react";
import CrossHover from "../assets/points/hover/cross.svg?react";

import CircleActive from "../assets/points/active/circle.svg?react";
import CrossActive from "../assets/points/active/cross.svg?react";

interface propsType {
  row: number;
  active: activeCardType;
  setPointActive: (n: string) => void;
  setActive: (n: activeCardType) => void;
  nextPoint: { current: string };
  selectedPoint: selectedPointType;
  setSelectedPoint: (n: selectedPointType) => void;
  Turn: { current: boolean };
  bot: boolean;
  player: string;
}

export default function Card({
  row,
  active,
  nextPoint,
  setPointActive,
  setActive,
  selectedPoint,
  setSelectedPoint,
  Turn,
  bot,
  player,
}: propsType) {
  const selectPoint = (point: number) => {
    if (bot) {
      if (player == nextPoint.current) {
        checklistBoard(point);
      } else {
        console.log("You cannot check this point, it's not your turn");
      }
    } else {
      checklistBoard(point);
    }
  };
  const checklistBoard = (point: number) => {
    if (active[point].type == "" && !active[point].active) {
      setActive({
        ...active,
        [point]: { ...active[point], type: nextPoint.current, active: true },
      });

      setSelectedPoint({
        ...selectedPoint,
        [nextPoint.current]: [...selectedPoint[nextPoint.current], point],
      });

      setPointActive(nextPoint.current == "cross" ? "circle" : "cross");
      Turn.current = true;
    }
  };

  const changeCardColor = (point: number) => {
    let initialClassName = "icon";

    if (active[point].active) {
      initialClassName += " show-img";

      if (active[point].win) {
        initialClassName += " point-color-win";
      } else {
        initialClassName +=
          active[point].type == "cross"
            ? " cross-active-style"
            : " circle-active-style";
      }
    } else {
      initialClassName +=
        nextPoint.current == "cross"
          ? " cross-hover-style"
          : " circle-hover-style";
    }

    return initialClassName;
  };

  const PointAlternate = (point: number) => {
    if (active[point].active) {
      return active[point].type == "cross" ? (
        <CrossActive className={changeCardColor(point)} />
      ) : (
        <CircleActive className={changeCardColor(point)} />
      );
    } else {
      if ((player == nextPoint.current && bot) || !bot) {
        return nextPoint.current == "cross" ? (
          <CrossHover className={changeCardColor(point)} />
        ) : (
          <CircleHover className={changeCardColor(point)} />
        );
      }
    }
  };

  const backgroundColorCardWinner = (point: number) => {
    let initialStyle = "card card-color";
    if (active[point].win) {
      if (active[point].type == "cross") {
        initialStyle += " card-color-win-cross";
      } else {
        initialStyle += " card-color-win-circle";
      }
    }
    return initialStyle;
  };

  const wrapperColorCardWinner = (point: number) => {
    let wrapperInitialStyle = "card-wrapper";
    if (active[point].win) {
      if (active[point].type == "cross") {
        wrapperInitialStyle += " card-wrapper-color-win-cross";
      } else {
        wrapperInitialStyle += " card-wrapper-color-win-circle";
      }
    }
    return wrapperInitialStyle;
  };

  return (
    <div className={wrapperColorCardWinner(row)}>
      <div
        onClick={() => selectPoint(row)}
        className={backgroundColorCardWinner(row)}
      >
        {PointAlternate(row)}
      </div>
    </div>
  );
}
