import GameState from "./GameState";
import Move from "./Move";
import PlayerSideColour from "./PlayerSideColour";
import FenSetup from "./FenSetup";
import Coordinates from "./chessboard/Coordinates";

describe("GameState", () => {
  describe("afterMove", () => {
    it.each<[string, string, Coordinates | null]>([
      [
        "h2h4",
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        Coordinates.fromAlgebraicNotation("h3")
      ],
      ["h1h3", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", null]
    ])(
      "should set a valid en passant %s",
      (moveString: string, fen: string, expected: Coordinates | null) => {
        // arrange
        const gameState = GameState.fromFen(fen);
        const move = Move.fromUciString(moveString);

        // act
        const result = gameState.afterMove(move).enPassant;

        // assert
        expect(result).toEqual(expected);
      }
    );

    it.each<[string, string, string[]]>([
      [
        "b2b4",
        "r3k2r/1pppppp1/8/8/8/8/1PPPPPP1/R3K2R w KQkq - 0 1",
        ["K", "Q", "k", "q"]
      ],
      [
        "h1h2",
        "r3k2r/1pppppp1/8/8/8/8/1PPPPPP1/R3K2R w KQkq - 0 1",
        ["Q", "k", "q"]
      ],
      [
        "a1a2",
        "r3k2r/1pppppp1/8/8/8/8/1PPPPPP1/R3K2R w KQkq - 0 1",
        ["K", "k", "q"]
      ],
      [
        "a8a7",
        "r3k2r/1pppppp1/8/8/8/8/1PPPPPP1/R3K2R w KQkq - 0 1",
        ["K", "Q", "k"]
      ],
      [
        "h8h7",
        "r3k2r/1pppppp1/8/8/8/8/1PPPPPP1/R3K2R w KQkq - 0 1",
        ["K", "Q", "q"]
      ],
      [
        "e2e4",
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        ["K", "Q", "k", "q"]
      ]
    ])("should set castlings %s", (moveString, fen, expected) => {
      // arrange
      const makeMove = Move.fromUciString(moveString);
      const gameState = GameState.fromFen(fen);

      // act
      const castlings = gameState.afterMove(makeMove).castlings;

      // assert
      expect(castlings).toEqual(expected);
    });

    it.each<[PlayerSideColour, string, string]>([
      [
        PlayerSideColour.white,
        "d7d5",
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"
      ],
      [
        PlayerSideColour.black,
        "d2d4",
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      ]
    ])("should set the color properly %s", (expected, move, fen) => {
      // arrange
      let gameState = GameState.fromFen(fen);

      // act
      let result = gameState.afterMove(Move.fromUciString(move)).currentColor;

      // assert
      expect(result).toBe(expected);
    });

    it.each<[number, string, string]>([
      [
        1,
        "e4e5",
        "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1"
      ],
      [
        0,
        "e4d5",
        "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1"
      ]
    ])("should set the halfmove clock properly %p", (expected, move, fen) => {
      // arrange
      let gameState = GameState.fromFen(fen);

      // act
      let result = gameState.afterMove(Move.fromUciString(move)).halfMoveClock;

      // assert
      expect(result).toBe(expected);
    });

    it.each<[number, string, string]>([
      [2, "d7d5", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"],
      [1, "d2d4", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]
    ])("should increment the full move number", (expected, move, fen) => {
      // arrange
      let gameState = GameState.fromFen(fen);

      // act
      let result = gameState.afterMove(Move.fromUciString(move)).fullMoveNumber;

      // assert
      expect(result).toBe(expected);
    });

    it.each<[string, string, string, string]>([
      [
        "regular move",
        FenSetup.defaultInitial,
        "e2e4",
        "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR"
      ],
      [
        "en passant",
        "r1bqkbnr/ppppp1pp/2n5/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 3 3",
        "e5f6",
        "r1bqkbnr/ppppp1pp/2n2P2/8/8/8/PPPP1PPP/RNBQKBNR"
      ],
      [
        "castling K",
        "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
        "e1g1",
        "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R4RK1"
      ],
      [
        "castling Q",
        "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
        "e1c1",
        "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/2KR3R"
      ],
      [
        "castling k",
        "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
        "e8g8",
        "r4rk1/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"
      ],
      [
        "castling q",
        "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
        "e8c8",
        "2kr3r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R"
      ]
    ])(
      "should set the board state properly: %s",
      (description, fen, move, expectedBoardFen) => {
        // arrange
        let gameState = GameState.fromFen(fen);

        // act
        let result = gameState
          .afterMove(Move.fromUciString(move))
          .board.toFen();

        // assert
        expect(result).toBe(expectedBoardFen);
      }
    );
  });
});
