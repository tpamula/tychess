import Move from "../../Move";
import Chessboard from "../../chessboard/Chessboard";
import Coordinates from "../../chessboard/Coordinates";

export default class PieceTraversal {
  static canTraverse(
    move: Move,
    board: Chessboard,
    allowCaptureOnFinalSquare: boolean,
    traversalStepsLimit: number = Number.POSITIVE_INFINITY
  ): boolean {
    return (
      move.isTraversable() &&
      !PieceTraversal.traversalStepsExceeded(move, traversalStepsLimit) &&
      PieceTraversal.hasNoUncapturablePiecesOnPath(
        move,
        board,
        allowCaptureOnFinalSquare,
        traversalStepsLimit
      )
    );
  }

  private static hasNoUncapturablePiecesOnPath(
    move: Move,
    board: Chessboard,
    allowCaptureOnFinalSquare: boolean,
    traversalStepsLimit: number
  ) {
    for (let traversalCoordinate of move.getTraversalCoordinatesBetweenFromTo()) {
      if (traversalStepsLimit-- <= 0) return true;

      const isPieceOnTraversalRoute = board.isPieceOnSquare(
        traversalCoordinate
      );
      if (
        PieceTraversal.isFinalSquare(traversalCoordinate, move.to) &&
        (!isPieceOnTraversalRoute ||
          (allowCaptureOnFinalSquare &&
            PieceTraversal.isCaptureValid(move, board)))
      ) {
        return true;
      }

      if (isPieceOnTraversalRoute) {
        return false;
      }
    }

    return true;
  }

  private static isCaptureValid(move: Move, board: Chessboard) {
    const doPiecesHaveDifferentColours =
      board.getPiece(move.from)!.color !== board.getPiece(move.to)!.color;

    return doPiecesHaveDifferentColours;
  }

  private static isFinalSquare(
    squareCoordinates: Coordinates,
    destination: Coordinates
  ) {
    return squareCoordinates.referentialEquals(destination);
  }

  private static traversalStepsExceeded(
    move: Move,
    traversalStepsLimit: number
  ): boolean {
    return (
      Math.abs(move.fileDelta) > traversalStepsLimit ||
      Math.abs(move.rankDelta) > traversalStepsLimit
    );
  }
}
