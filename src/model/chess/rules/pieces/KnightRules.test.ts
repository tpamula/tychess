import GameState from "../../GameState";
import TestUtils from "./TestUtils";
import KnightRules from "./KnightRules";

describe("KnightRules", () => {
  it.each<[string, Set<string>, string]>([
    [
      "f4",
      new Set(["f4g2", "f4d3", "f4h3", "f4d5", "f4h5", "f4e6", "f4g6"]),
      "rnbqkbnr/pppp1ppp/4p3/8/5N2/6P1/PPPPPP1P/RNBQKB1R w KQkq - 0 1"
    ]
  ])("should detect valid moves for a knight on %p", (from, expected, fen) => {
    // arrange
    const gameState = GameState.fromFen(fen);

    // act
    const result = TestUtils.getAllAllowedMoves(
      new KnightRules(),
      gameState,
      from
    );

    // assert
    expect(result).toEqual(expected);
  });
});
