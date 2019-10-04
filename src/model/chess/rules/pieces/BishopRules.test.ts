import GameState from "../../GameState";
import BishopRules from "./BishopRules";
import TestUtils from "./TestUtils";

describe("BishopRules", () => {
  it.each<[string, Set<string>, string]>([
    [
      "f4",
      new Set(["f4e3", "f4g3", "f4e5", "f4g5", "f4d6", "f4h6", "f4c7"]),
      "rnbqkbnr/pppppppp/8/8/5B2/8/PPPPPPPP/RNBQK1NR w KQkq - 0 1"
    ]
  ])("should detect valid moves for a bishop on %p", (from, expected, fen) => {
    // arrange
    const gameState = GameState.fromFen(fen);

    // act
    const result = TestUtils.getAllAllowedMoves(
      new BishopRules(),
      gameState,
      from
    );

    // assert
    expect(result).toEqual(expected);
  });
});
