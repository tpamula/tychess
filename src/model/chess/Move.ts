import ValueObject from "../seedwork/ValueObject";
import Piece, { pieceAlgebraicNotation } from "./Piece";
import Coordinates from "./chessboard/Coordinates";
import { files } from "./chessboard/File";
import { ranks } from "./chessboard/Rank";

export default class Move extends ValueObject<Move> {
  constructor(
    readonly from: Coordinates,
    readonly to: Coordinates,
    readonly promoteTo: Piece | null = null
  ) {
    super();
  }

  get fileDelta(): number {
    return files.indexOf(this.to.file) - files.indexOf(this.from.file);
  }

  get fileDirection(): direction {
    return Math.sign(this.fileDelta) as direction;
  }

  get hasPromotion(): boolean {
    return this.promoteTo !== null;
  }

  get isDiagonal(): boolean {
    return (
      Math.abs(this.rankDelta) === Math.abs(this.fileDelta) &&
      this.rankDelta !== 0
    );
  }

  get isHorizontalOrVertical(): boolean {
    return (
      (this.rankDirection !== 0 && this.fileDirection === 0) ||
      (this.rankDirection === 0 && this.fileDirection !== 0)
    );
  }

  get rankDelta(): number {
    return this.to.rank - this.from.rank;
  }

  get rankDirection(): direction {
    return Math.sign(this.rankDelta) as direction;
  }

  static fromUciString(uciString: string): Move {
    const from = Coordinates.fromAlgebraicNotation(uciString.substring(0, 2));
    const to = Coordinates.fromAlgebraicNotation(uciString.substring(2, 4));
    const promoteTo =
      uciString.length === 5
        ? Piece.fromAlgebraicNotation(uciString[4] as pieceAlgebraicNotation)
        : null;

    return new Move(from, to, promoteTo);
  }

  getTraversalCoordinatesBetweenFromTo(): Coordinates[] {
    const result: Coordinates[] = [];
    if (!this.isDiagonal && !this.isHorizontalOrVertical) return result;

    for (
      let fileIteratorCount = this.fileDirection,
        rankIteratorCount = this.rankDirection;
      !(
        fileIteratorCount === this.fileDelta &&
        rankIteratorCount === this.rankDelta
      );
      fileIteratorCount += this.fileDirection,
        rankIteratorCount += this.rankDirection
    ) {
      const fileIndex = files.indexOf(this.from.file) + fileIteratorCount;
      const rankIndex = ranks.indexOf(this.from.rank) + rankIteratorCount;

      const fieldCoordinates = new Coordinates(
        files[fileIndex],
        ranks[rankIndex]
      );

      result.push(fieldCoordinates);
    }

    // the previous iteration doesn't handle the "to" field itself, so:
    result.push(this.to);

    return result;
  }

  isTraversable(): boolean {
    return this.isDiagonal || this.isHorizontalOrVertical;
  }

  toUciString(): string {
    return `${this.from.file}${this.from.rank}${this.to.file}${
      this.to.rank
    }${this.promoteTo || ""}`;
  }
}

export type direction = -1 | 0 | 1;
