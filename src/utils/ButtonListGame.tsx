import { ScoreType } from "../types/type";

interface propsType {
  funcStatus: () => string;
  funcRound: () => string;
  score: ScoreType;
}

export default function ButtonListGame({ funcStatus, funcRound, score }: propsType) {
  return [
    {
      ind: 1,
      name: funcStatus(),
      fore_color: "var(--info-color)",
      back_color: "var(--info-color-dark)",
      hover: false,
      font_size: "1rem",
    },
    {
      ind: 2,
      name: "PAUSE",
      fore_color: "var(--light-green)",
      back_color: "var(--dark-green)",
      hover: true,
    },
    {
      ind: 3,
      name: funcRound(),
      fore_color: "var(--info-color)",
      back_color: "var(--info-color-dark)",
      hover: false,
      font_size: "1rem",
    },
    {
      ind: 4,
      name: "YOU",
      fore_color: "var(--backdrop-circle)",
      back_color: "var(--circle-color)",
      hover: false,
      font_size: "1rem",
      subtitle: score.playerOneWin.toString(),
    },

    {
      ind: 5,
      name: "TIE",
      fore_color: "var(--tie-color-dark)",
      back_color: "var(--tie-color)",
      hover: false,
      font_size: "1rem",
      subtitle: score.tie.toString(),
    },

    {
      ind: 6,
      name: "OPP",
      fore_color: "var(--backdrop-cross)",
      back_color: "var(--cross-color)",
      hover: false,
      font_size: "1rem",
      subtitle: score.playerTwoWin.toString(),
    },
  ];
}
