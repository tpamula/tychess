import ChessRules from "./ChessRules";
import TestUtils from "./pieces/TestUtils";
import GameState from "../GameState";
import GameStatus from "../GameStatus";

// TODO TPX If the last move of such series delivers a checkmate, this takes precedence over the 50 move rule.

describe("ChessRules", () => {
  it.each<[string, string, Set<string>]>([
    ["d5", "8/3k4/8/3b4/8/8/3R4/8 b - - 0 1", new Set()],
    ["d4", "8/8/2q5/8/3KP3/8/4q3/8 w - - 0 1", new Set(["d4e5"])],
    [
      "g1",
      "r1b1kb1r/pp2pppp/2n2n2/1p1q4/3P4/2P5/PP3PpP/RNBQR1K1 w - - 0 1",
      new Set()
    ]
  ])(
    "should not allow a move that opens up an attack on own king %s",
    (position, fen, expected) => {
      // arrange
      const gameState = GameState.fromFen(fen);

      // act
      const result = TestUtils.getAllAllowedMoves(
        new ChessRules(),
        gameState,
        position
      );

      // assert
      expect(result).toEqual(expected);
    }
  );

  it.each<[GameStatus, string[]]>([
    [
      GameStatus.ongoing,
      ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]
    ],
    [GameStatus.ongoingWhiteKingInCheck, ["5k2/8/5q2/8/3K4/8/8/8 w - - 0 1"]],
    [GameStatus.ongoingBlackKingInCheck, ["k6Q/8/8/4K3/8/8/8/8 b - - 0 1"]],
    [GameStatus.checkmateWhiteWon, ["Q7/8/k1K5/8/8/8/8/8 b - - 0 1"]],
    [GameStatus.checkmateBlackWon, ["q7/8/K1k5/8/8/8/8/8 w - - 0 1"]],
    [GameStatus.drawStalemate, ["K7/2q5/2k5/8/8/8/8/8 w - - 0 1"]],
    [
      GameStatus.drawThreefoldRepetition,
      [
        "K7/8/2k5/8/8/8/8/7r w - - 0 1", // 1st
        "8/K7/2k5/8/8/8/8/7r b - - 0 1",
        "8/K7/8/2k5/8/8/8/7r w - - 0 1",
        "K7/8/8/2k5/8/8/8/7r b - - 0 1",
        "K7/8/2k5/8/8/8/8/7r w - - 0 1", // 2nd
        "8/K7/2k5/8/8/8/8/7r b - - 0 1",
        "8/K7/8/2k5/8/8/8/7r w - - 0 1",
        "K7/8/8/2k5/8/8/8/7r b - - 0 1",
        "K7/8/2k5/8/8/8/8/7r w - - 0 1" // 3rd
      ]
    ],
    [
      GameStatus.draw50MoveRule,
      ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 100 1"]
    ]
  ])(
    "should provide correct game status: %s",
    (expected: GameStatus, fenHistory: string[]) => {
      // arrange
      let gameStateHistory = fenHistory.map(f => GameState.fromFen(f));

      // act
      let result = new ChessRules().getGameStatus(gameStateHistory);

      // assert
      expect(result).toEqual(expected);
    }
  );
});
