import PieceRules from "./PieceRules";
import Move from "../../Move";
import GameState from "../../GameState";
import QueenRules from "./QueenRules";
import Castling, { CastlingService } from "../../Castling";
import PlayerSideColour from "../../PlayerSideColour";
import ChessGameEngineError from "../../ChessGameEngineError";
import ChessRules from "../ChessRules";
import CoordinatesCalculator from "../../chessboard/CoordinatesCalculator";
import Coordinates from "../../chessboard/Coordinates";

export default class KingRules implements PieceRules {
  private readonly _kingCastlingRules = new KingCastlingRules();

  isMoveValid(move: Move, gameState: GameState): boolean {
    return (
      !move.hasPromotion &&
      (this._kingCastlingRules.isValidCastling(move, gameState) ||
        (!this.movesByMoreThanOneField(move) &&
          new QueenRules().isMoveValid(move, gameState)))
    );
  }

  private movesByMoreThanOneField(move: Move): boolean {
    return Math.abs(move.fileDelta) > 1 || Math.abs(move.rankDelta) > 1;
  }
}

class KingCastlingRules {
  private readonly _chessRules: ChessRules = new ChessRules();

  isValidCastling(move: Move, gameState: GameState): boolean {
    const castling = CastlingService.kingMoveToCastling(move);
    if (castling === null) return false;

    return (
      gameState.castlings.includes(castling) &&
      !this.isPieceBetweenKingAndRook(castling, gameState) &&
      !this.kingMovesThroughAttackedField(castling, move, gameState)
    );
  }

  private getCoordinatesBetweenKingAndRook(castling: Castling): Coordinates[] {
    let result: Coordinates[] = [];

    const kingCoordinates: Coordinates = CastlingService.getCastlingKingCoordinates(
      castling
    );

    let kingToRookFileDelta;
    switch (castling) {
      case Castling.whiteKingside:
      case Castling.blackKingside:
        kingToRookFileDelta = 3;
        break;
      case Castling.whiteQueenside:
      case Castling.blackQueenside:
        kingToRookFileDelta = -4;
        break;
      default:
        throw new ChessGameEngineError("Invalid castling.");
    }

    for (
      let fileDelta = Math.sign(kingToRookFileDelta);
      Math.abs(fileDelta) < Math.abs(kingToRookFileDelta);
      fileDelta += Math.sign(kingToRookFileDelta)
    ) {
      result.push(CoordinatesCalculator.add(kingCoordinates, fileDelta, 0));
    }

    return result;
  }

  private isPieceBetweenKingAndRook(
    castling: Castling,
    gameState: GameState
  ): boolean {
    for (let coordinates of this.getCoordinatesBetweenKingAndRook(castling)) {
      if (gameState.board.getPiece(coordinates) !== null) {
        return true;
      }
    }

    return false;
  }

  private kingMovesThroughAttackedField(
    castling: Castling,
    move: Move,
    gameState: GameState
  ): boolean {
    const isKingAttacked = this._chessRules.isSquareAttacked(
      move.from,
      gameState,
      CastlingService.getCastlingColor(castling) === PlayerSideColour.white
        ? PlayerSideColour.black
        : PlayerSideColour.white
    );
    if (isKingAttacked) return true;

    for (let coordinates of this.getCoordinatesBetweenKingAndRook(castling)) {
      if (
        this._chessRules.isSquareAttacked(
          coordinates,
          gameState,
          CastlingService.getCastlingColor(castling) === PlayerSideColour.white
            ? PlayerSideColour.black
            : PlayerSideColour.white
        )
      ) {
        return true;
      }
    }

    return false;
  }
}
