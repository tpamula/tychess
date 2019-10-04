import PawnRules from "./PawnRules";
import GameState from "../../GameState";
import Move from "../../Move";
import TestUtils from "./TestUtils";
import Coordinates from "../../chessboard/Coordinates";

describe("PawnRules", () => {
  const testWhiteFens = {
    initialState: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    d3Pawn: "rnbqkbnr/1ppppppp/p7/8/8/3P4/PPP1PPPP/RNBQKBNR w KQkq - 0 1",
    forwardPromotion: "rnbqk3/ppppp1P1/8/8/8/8/PPPPPP1P/RNBQKBNR w KQkq - 0 1",
    attack: "2bqkbn1/pppppppp/8/8/2nrr3/3P4/PPP1PPPP/RNBQKBNR w KQkq - 0 1",
    attackWithPromotion:
      "rnbqkb1q/ppppp1P1/8/8/8/8/PPPPPP1P/RNBQKBNR w KQq - 0 1",
    enPassant: "rnbqkbnr/p1pppppp/8/Pp6/8/8/1PPPPPPP/RNBQKBNR w KQkq b6 0 1"
  };
  const testBlackFens = {
    initialState: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1",
    d6Pawn:
      "rnbqkbnr/ppp1pppp/3p4/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - w KQkq - 0 1",
    forwardPromotion: "rnbqkbnr/pppppp1p/8/8/8/8/PPPPP1p1/RNBQK3 w KQkq - 0 1",
    attack: "rnbqkbnr/ppp1pppp/3p4/2RRN3/8/8/PPPPPPPP/1NBQKB2 w KQkq - 0 1",
    attackWithPromotion:
      "rnbqkbnr/pppppp1p/8/8/8/8/PPPPP1p1/RNBQKB1Q w Qkq - w KQq - 0 1",
    enPassant: "rnbqkbnr/p1pppppp/8/8/Pp6/8/1PPPPPPP/RNBQKBNR w KQkq a3 0 1"
  };

  it.each`
    description                           | from    | validTo                        | appendValidPiecePromotionsTo   | fen
    ${"white forward move starting rank"} | ${"h2"} | ${new Set(["h3", "h4"])}       | ${new Set()}                   | ${testWhiteFens.initialState}
    ${"white forward move"}               | ${"d3"} | ${new Set(["d4"])}             | ${new Set()}                   | ${testWhiteFens.d3Pawn}
    ${"white promotion"}                  | ${"g7"} | ${new Set(["g8"])}             | ${new Set(["g8"])}             | ${testWhiteFens.forwardPromotion}
    ${"white attack"}                     | ${"d3"} | ${new Set(["c4", "e4"])}       | ${new Set()}                   | ${testWhiteFens.attack}
    ${"white attack with promotion"}      | ${"g7"} | ${new Set(["f8", "g8", "h8"])} | ${new Set(["f8", "g8", "h8"])} | ${testWhiteFens.attackWithPromotion}
    ${"white en passant"}                 | ${"a5"} | ${new Set(["a6", "b6"])}       | ${new Set()}                   | ${testWhiteFens.enPassant}
    ${"black forward move starting rank"} | ${"d2"} | ${new Set(["d3", "d4"])}       | ${new Set()}                   | ${testBlackFens.initialState}
    ${"black forward move"}               | ${"d6"} | ${new Set(["d5"])}             | ${new Set()}                   | ${testBlackFens.d6Pawn}
    ${"black promotion"}                  | ${"g2"} | ${new Set(["g1"])}             | ${new Set(["g1"])}             | ${testBlackFens.forwardPromotion}
    ${"black attack"}                     | ${"d6"} | ${new Set(["c5", "e5"])}       | ${new Set()}                   | ${testBlackFens.attack}
    ${"black attack with promotion"}      | ${"g2"} | ${new Set(["f1", "g1", "h1"])} | ${new Set(["f1", "g1", "h1"])} | ${testBlackFens.attackWithPromotion}
    ${"black en passant"}                 | ${"b4"} | ${new Set(["a3", "b3"])}       | ${new Set()}                   | ${testBlackFens.enPassant}
    ${"black en passant not reachable"}   | ${"a7"} | ${new Set(["a5", "a6"])}       | ${new Set()}                   | ${testBlackFens.enPassant}
  `(
    "should detect valid moves for a pawn variant: $description",
    ({
      from,
      validTo,
      appendValidPiecePromotionsTo,
      fen
    }: {
      from: string;
      validTo: Set<string>;
      appendValidPiecePromotionsTo: Set<string>;
      fen: string;
    }) => {
      // arrange
      const gameState = GameState.fromFen(fen);
      const expected = TestUtils.createExpectedAppendingPromotionsToMoves(
        from,
        validTo,
        gameState.board.getPiece(Coordinates.fromAlgebraicNotation(from))!
          .color,
        appendValidPiecePromotionsTo
      );

      // act
      const result = TestUtils.getAllAllowedMoves(
        new PawnRules(),
        gameState,
        from
      );

      // assert
      expect(result).toEqual(expected);
    }
  );

  it("should not allow promotion without specifying the piece to promote to", () => {
    // arrange
    const gameState = GameState.fromFen(testWhiteFens.attackWithPromotion);
    const move = Move.fromUciString("g7g8");

    // act
    const result = new PawnRules().isMoveValid(move, gameState);

    // assert
    expect(result).toBe(false);
  });
});
