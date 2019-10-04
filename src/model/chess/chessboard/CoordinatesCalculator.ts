import Coordinates from "./Coordinates";
import ChessGameEngineError from "../ChessGameEngineError";
import File, { files } from "./File";
import Rank, { ranks } from "./Rank";

export default class CoordinatesCalculator {
  static add(
    element: Coordinates,
    fileDelta: number,
    rankDelta: number
  ): Coordinates {
    if (!this.canAdd(element, fileDelta, rankDelta))
      throw new ChessGameEngineError(
        `Invalid operation - element: ${element.toAlgebraicNotationString()}, fileDelta: ${fileDelta}, rankDelta: ${rankDelta}.`
      );

    return new Coordinates(
      this.addFile(element.file, fileDelta),
      this.addRank(element.rank, rankDelta)
    );
  }

  static canAdd(
    element: Coordinates,
    fileDelta: number,
    rankDelta: number
  ): boolean {
    return (
      CoordinatesCalculator.canAddFile(element.file, fileDelta) &&
      CoordinatesCalculator.canAddRank(element.rank, rankDelta)
    );
  }

  static tryAdd(
    element: Coordinates,
    fileDelta: number,
    rankDelta: number
  ): Coordinates | null {
    if (!this.canAdd(element, fileDelta, rankDelta)) return null;

    return this.add(element, fileDelta, rankDelta);
  }

  private static addFile(file: File, delta: number): File {
    if (!this.canAddFile(file, delta))
      throw new ChessGameEngineError(
        `Invalid operation - file: ${file}, delta: ${delta}.`
      );

    return files[files.indexOf(file) + delta];
  }

  private static addRank(rank: Rank, delta: number): Rank {
    if (!this.canAddRank(rank, delta))
      throw new ChessGameEngineError(
        `Invalid operation - rank: ${rank}, delta: ${delta}.`
      );

    return (rank + delta) as Rank;
  }

  private static canAddFile(file: File, delta: number): boolean {
    const fileIndex = files.indexOf(file) + delta;

    return Array.from(files.keys()).includes(fileIndex);
  }

  private static canAddRank(rank: Rank, delta: number): boolean {
    return ranks.map(r => r as number).includes((rank as number) + delta);
  }
}
