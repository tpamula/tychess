import ValueObject from "../../seedwork/ValueObject";
import Piece, { pieceAlgebraicNotation } from "../Piece";
import Move from "../Move";
import Coordinates from "./Coordinates";
import Rank, { ranks } from "./Rank";
import File, { files } from "./File";

export default class Chessboard extends ValueObject<Chessboard> {
  static readonly allCoordinates: Coordinates[] = Chessboard.getAllCoordinates();
  private _internalState: (Piece | null)[][] = [...Array(8)].map(() =>
    Array(8).fill(null)
  );

  private constructor() {
    super();
  }

  static fromFen(fen: string): Chessboard {
    const result = new Chessboard();

    let fileIndex = 0;
    let rankIndex = ranks.length - 1;

    const fenPiecePart = fen.split(" ")[0];
    for (let i = 0; i < fenPiecePart.length; i++) {
      if (fen[i] === "/") {
        rankIndex--;
        fileIndex = 0;
        continue;
      }

      const asNumber = parseInt(fen[i], 10);
      if (!isNaN(asNumber)) {
        fileIndex += asNumber;
        continue;
      }

      const internalRow = Chessboard.rankToRow(ranks[rankIndex]);
      const internalColumn = Chessboard.fileToColumn(files[fileIndex]);
      result._internalState[internalRow][
        internalColumn
      ] = Piece.fromAlgebraicNotation(fen[i] as pieceAlgebraicNotation);
      fileIndex++;
    }

    return result;
  }

  private static fileToColumn(file: File): number {
    return file.charCodeAt(0) - "a".charCodeAt(0);
  }

  private static getAllCoordinates(): Coordinates[] {
    let result = [];

    for (const file of files)
      for (const rank of ranks) {
        const coordinates = new Coordinates(file, rank);
        result.push(coordinates);
      }

    return result;
  }

  private static rankToRow(rank: Rank): number {
    return rank - 1;
  }

  findPieceCoordinates(piece: Piece): Coordinates[] {
    const result: Coordinates[] = [];

    for (let squareCoordinates of Chessboard.allCoordinates) {
      const pieceOnCoordinates = this.getPiece(squareCoordinates);

      if (pieceOnCoordinates === piece) {
        result.push(squareCoordinates);
      }
    }

    return result;
  }

  getPiece(position: Coordinates): Piece | null {
    const internalRow = Chessboard.rankToRow(position.rank);
    const internalColumn = Chessboard.fileToColumn(position.file);

    return this._internalState[internalRow][internalColumn];
  }

  isPieceOnSquare = (squareCoordinates: Coordinates) => {
    return this.getPiece(squareCoordinates) !== null;
  };

  toFen(): string {
    let result = "";

    let emptyPieceCounter = 0;
    const writeDownAndResetEmptyPieceCounterIfIsNot0 = (): void => {
      if (emptyPieceCounter !== 0) {
        result += emptyPieceCounter;
        emptyPieceCounter = 0;
      }
    };

    for (let rankIndex = ranks.length - 1; rankIndex >= 0; rankIndex--) {
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const current = this.getPiece(
          new Coordinates(files[fileIndex], ranks[rankIndex])
        );

        if (current === null) emptyPieceCounter++;
        else {
          writeDownAndResetEmptyPieceCounterIfIsNot0();
          result += current.algebraicNotation;
        }
      }
      writeDownAndResetEmptyPieceCounterIfIsNot0();

      if (rankIndex !== 0) result += "/";
    }

    return result;
  }

  withMove(move: Move): Chessboard {
    const piece = this.getPiece(move.from);
    return this.withPiece(move.from, null).withPiece(move.to, piece);
  }

  withPiece(position: Coordinates, piece: Piece | null): Chessboard {
    const internalRow = Chessboard.rankToRow(position.rank);
    const internalColumn = Chessboard.fileToColumn(position.file);

    const clone = this.clone();
    clone._internalState[internalRow][internalColumn] = piece;

    return clone;
  }

  private clone(): Chessboard {
    const clone = new Chessboard();
    clone._internalState = JSON.parse(JSON.stringify(this._internalState));

    return clone;
  }
}
