type activeType = {
  type: string;
  active: boolean;
  win: boolean;
};

type activeCardType = {
  [e: number]: activeType;
};

type selectedPointType = {
  [a: string]: number[];
};

type ScoreType = {
  playerOneWin: number;
  playerTwoWin: number;
  tie: number;
};

export type { selectedPointType, activeCardType, ScoreType };
