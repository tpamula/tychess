import PieceRules from "./PieceRules";
import Move from "../../Move";
import GameState from "../../GameState";
import ChessGameEngineError from "../../ChessGameEngineError";
import CoordinatesCalculator from "../../chessboard/CoordinatesCalculator";
import Coordinates from "../../chessboard/Coordinates";

export default class KnightRules implements PieceRules {
  isMoveValid(move: Move, gameState: GameState): boolean {
    return (
      !move.hasPromotion &&
      this.getPossibleLandingCoordinates(move.from).some(
        plc =>
          move.to.referentialEquals(plc) &&
          this.landsOnEmptyOrOppositeColor(move, gameState)
      )
    );
  }

  private getPossibleLandingCoordinates(from: Coordinates): Coordinates[] {
    const result = [];
    const knightDirections = [-1, 1];

    for (const rankDirection of knightDirections) {
      for (const fileDirection of knightDirections) {
        let coordinates = CoordinatesCalculator.tryAdd(
          from,
          fileDirection,
          rankDirection * 2
        );
        if (coordinates !== null) result.push(coordinates);

        coordinates = CoordinatesCalculator.tryAdd(
          from,
          fileDirection * 2,
          rankDirection
        );
        if (coordinates !== null) result.push(coordinates);
      }
    }

    return result;
  }

  private landsOnEmptyOrOppositeColor(
    move: Move,
    gameState: GameState
  ): boolean {
    const knightPiece = gameState.board.getPiece(move.from);

    if (knightPiece === null) throw new ChessGameEngineError("Knight is null.");

    const toFieldPiece = gameState.board.getPiece(move.to);
    return toFieldPiece === null || toFieldPiece.color !== knightPiece.color;
  }
}
