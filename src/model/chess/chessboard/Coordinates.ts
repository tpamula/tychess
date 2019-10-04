import ValueObject from "../../seedwork/ValueObject";
import ChessGameEngineError from "../ChessGameEngineError";
import Rank, { isRank } from "./Rank";
import File, { isFile } from "./File";

export default class Coordinates extends ValueObject<Coordinates> {
  readonly file: File;
  readonly rank: Rank;

  constructor(file: File, rank: Rank) {
    super();

    this.file = file;
    this.rank = rank;
  }

  /**
   *
   * @param algebraicCoordinatesString e.g. d2, e4
   */
  static fromAlgebraicNotation(
    algebraicCoordinatesString: string
  ): Coordinates {
    const file = algebraicCoordinatesString[0] as File;
    const rank = parseInt(algebraicCoordinatesString[1], 10) as Rank;

    if (!isFile(file) || !isRank(rank))
      throw new ChessGameEngineError(
        `Invalid from file/rank - file: ${file} rank: ${rank}.`
      );

    return new Coordinates(file, rank);
  }

  toAlgebraicNotationString(): string {
    return `${this.file}${this.rank}`;
  }
}
