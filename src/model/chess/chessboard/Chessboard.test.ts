import Chessboard from "./Chessboard";
import Coordinates from "./Coordinates";
import Piece from "../Piece";
import FenSetup from "../FenSetup";
import File, { files } from "./File";
import Rank, { ranks } from "./Rank";

describe("Chessboard", () => {
  it("should create an empty board", () => {
    // arrange

    // act
    const boardState = Chessboard.fromFen(FenSetup.empty);

    // assert
    for (const file of files)
      for (const rank of ranks) {
        expect(boardState.getPiece(new Coordinates(file, rank))).toBe(null);
      }
  });

  it("should allow setting a piece", () => {
    // arrange
    const board = Chessboard.fromFen(FenSetup.empty);
    const pieceFile: File = "c";
    const pieceRank: Rank = 5;
    const piece: Piece = Piece.BlackQueen;

    // act
    const result = board.withPiece(
      new Coordinates(pieceFile, pieceRank),
      piece
    );

    // assert
    for (const file of files)
      for (const rank of ranks) {
        if (file === pieceFile && rank === pieceRank) continue;

        expect(result.getPiece(new Coordinates(file, rank))).toBe(null);
      }
    expect(result.getPiece(new Coordinates(pieceFile, pieceRank))).toBe(piece);
  });

  it("should create from FEN notation", () => {
    // arrange
    const fenBoardPart = FenSetup.defaultInitial.split(" ")[0];

    // act
    const board = Chessboard.fromFen(FenSetup.defaultInitial);

    // assert
    expect(board.toFen()).toEqual(fenBoardPart);
  });

  it.each<[string, Piece | null]>([
    ["d1", Piece.WhiteQueen],
    ["b2", Piece.WhitePawn],
    ["c3", null],
    ["e8", Piece.BlackKing],
    ["h8", Piece.BlackRook],
    ["g7", Piece.BlackPawn],
    ["f6", null]
  ])("should return a correct piece", (coordinatesString, piece) => {
    // arrange
    const initialFen =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    // act
    const board = Chessboard.fromFen(initialFen);

    // assert
    expect(
      board.getPiece(Coordinates.fromAlgebraicNotation(coordinatesString))
    ).toBe(piece);
  });
});
