import PlayerSideColour from "./PlayerSideColour";
import ValueObject from "../seedwork/ValueObject";

export type pieceAlgebraicNotation =
  | "P"
  | "R"
  | "N"
  | "B"
  | "Q"
  | "K"
  | "p"
  | "r"
  | "n"
  | "b"
  | "q"
  | "k";

export default class Piece extends ValueObject<Piece> {
  static BlackBishop = new Piece("b");
  static BlackKing = new Piece("k");
  static BlackKnight = new Piece("n");
  static BlackPawn = new Piece("p");
  static BlackQueen = new Piece("q");
  static BlackRook = new Piece("r");
  static WhiteBishop = new Piece("B");
  static WhiteKing = new Piece("K");
  static WhiteKnight = new Piece("N");
  static WhitePawn = new Piece("P");
  static WhiteQueen = new Piece("Q");
  static WhiteRook = new Piece("R");
  readonly algebraicNotation: pieceAlgebraicNotation;
  readonly color: PlayerSideColour;
  readonly unicodeSymbol: string;

  private constructor(pieceAlgebraicNotation: pieceAlgebraicNotation) {
    super();

    this.algebraicNotation = pieceAlgebraicNotation;
    this.color =
      pieceAlgebraicNotation.toUpperCase() === pieceAlgebraicNotation
        ? PlayerSideColour.white
        : PlayerSideColour.black;

    this.unicodeSymbol = this.getUnicodeSymbol(pieceAlgebraicNotation);
  }

  static fromAlgebraicNotation(
    pieceAlgebraicNotation: pieceAlgebraicNotation
  ): Piece {
    switch (pieceAlgebraicNotation) {
      case "P":
        return Piece.WhitePawn;
      case "R":
        return Piece.WhiteRook;
      case "N":
        return Piece.WhiteKnight;
      case "B":
        return Piece.WhiteBishop;
      case "Q":
        return Piece.WhiteQueen;
      case "K":
        return Piece.WhiteKing;
      case "p":
        return Piece.BlackPawn;
      case "r":
        return Piece.BlackRook;
      case "n":
        return Piece.BlackKnight;
      case "b":
        return Piece.BlackBishop;
      case "q":
        return Piece.BlackQueen;
      case "k":
        return Piece.BlackKing;
    }
  }

  private getUnicodeSymbol(
    pieceAlgebraicNotation: pieceAlgebraicNotation
  ): string {
    switch (pieceAlgebraicNotation) {
      case "P":
        return "♙";
      case "R":
        return "♖";
      case "N":
        return "♘";
      case "B":
        return "♗";
      case "Q":
        return "♕";
      case "K":
        return "♔";
      case "p":
        return "♟";
      case "r":
        return "♜";
      case "n":
        return "♞";
      case "b":
        return "♝";
      case "q":
        return "♛";
      case "k":
        return "♚";
    }
  }
}
