import GameState from "../../GameState";
import TestUtils from "./TestUtils";
import QueenRules from "./QueenRules";

describe("QueenRules", () => {
  it.each<[string, Set<string>, string]>([
    [
      "f4",
      new Set([
        "f4h2",
        "f4e3",
        "f4f3",
        "f4g3",
        "f4c4",
        "f4d4",
        "f4e4",
        "f4g4",
        "f4h4",
        "f4e5",
        "f4f5",
        "f4g5",
        "f4d6",
        "f4h6",
        "f4d6",
        "f4f6",
        "f4h6",
        "f4c7",
        "f4b8"
      ]),
      "rnbqkbnr/pp1pp1pp/2p2p2/8/1P3Q2/7P/P1PPPPP1/RNB1KBNR w KQkq - 0 1"
    ]
  ])("should detect valid moves for a queen on %p", (from, expected, fen) => {
    // arrange
    const gameState = GameState.fromFen(fen);

    // act
    const result = TestUtils.getAllAllowedMoves(
      new QueenRules(),
      gameState,
      from
    );

    // assert
    expect(result).toEqual(expected);
  });
});
