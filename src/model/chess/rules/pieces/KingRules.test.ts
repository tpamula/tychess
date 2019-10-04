import GameState from "../../GameState";
import TestUtils from "./TestUtils";
import KingRules from "./KingRules";

describe("KingRules", () => {
  it.each<[string, Set<string>, string]>([
    [
      "e4",
      new Set(["e4d3", "e4e3", "e4d4", "e4d5", "e4f4", "e4e5", "e4f5"]),
      "rnbqkbnr/ppp1pppp/8/3p4/4K3/5P2/PPPPP1PP/RNBQ1BNR w KQkq - 0 1"
    ]
  ])("should find only valid moves for king on %p", (from, expected, fen) => {
    // arrange
    const gameState = GameState.fromFen(fen);

    // act
    const result = TestUtils.getAllAllowedMoves(
      new KingRules(),
      gameState,
      from
    );

    // assert
    expect(result).toEqual(expected);
  });

  it.each<[string, string, Set<string>, string]>([
    [
      "white allowed",
      "e1",
      new Set(["e1g1", "e1c1", "e1d1", "e1f1"]),
      "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1"
    ],
    [
      "white allowed 2",
      "e1",
      new Set(["e1g1", "e1f1", "e1e2"]),
      "rnbqkbnr/pp2pppp/2p5/1B6/4p3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1"
    ],
    [
      "black allowed",
      "e8",
      new Set(["e8g8", "e8c8", "e8d8", "e8f8"]),
      "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1"
    ],
    [
      "white forbidden",
      "e1",
      new Set(),
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    ],
    [
      "black forbidden",
      "e8",
      new Set(),
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    ],
    [
      "white forbidden - king under attack",
      "e1",
      new Set(["e1d1", "e1f1", "e1d2"]),
      "r2qk2r/ppp2ppp/5n2/4p3/1b1n4/1P1P2P1/PBP1QPBP/RN2K2R w KQkq - 0 1"
    ]
  ])(
    "should find valid moves for a castling variant: %s",
    (description, from, expected, fen) => {
      // arrange
      const gameState = GameState.fromFen(fen);

      // act
      const result = TestUtils.getAllAllowedMoves(
        new KingRules(),
        gameState,
        from
      );

      // assert
      expect(result).toEqual(expected);
    }
  );
});
