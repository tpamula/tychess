import GameState from "../../GameState";
import TestUtils from "./TestUtils";
import RookRules from "./RookRules";

describe("RookRules", () => {
  it.each<[string, Set<string>, string]>([
    [
      "c4",
      new Set([
        "c4c3",
        "c4a4",
        "c4b4",
        "c4d4",
        "c4e4",
        "c4f4",
        "c4g4",
        "c4h4",
        "c4c5",
        "c4c6",
        "c4c7"
      ]),
      "rnbqkbnr/pppppppp/8/8/2R5/8/PPPPPPPP/1NBQKBNR w KQkq - 0 1"
    ]
  ])("should detect valid moves for a rook on %p", (from, expected, fen) => {
    // arrange
    const gameState = GameState.fromFen(fen);

    // act
    const result = TestUtils.getAllAllowedMoves(
      new RookRules(),
      gameState,
      from
    );

    // assert
    expect(result).toEqual(expected);
  });
});
