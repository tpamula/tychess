import Move from "../../Move";
import GameState from "../../GameState";
import PlayerSideColour from "../../PlayerSideColour";
import PieceRules from "./PieceRules";
import Piece from "../../Piece";
import PieceTraversal from "./PieceTraversal";
import ChessGameEngineError from "../../ChessGameEngineError";
import CoordinatesCalculator from "../../chessboard/CoordinatesCalculator";
import Coordinates from "../../chessboard/Coordinates";

export default class PawnRules implements PieceRules {
  isMoveValid(move: Move, gameState: GameState): boolean {
    return (
      this.doesMoveForward(move, gameState) &&
      this.hasValidPromotionOnlyIfLandingOnEndRow(move, gameState) &&
      this.landsOnSquareWithEmptyOrOppositePiece(move, gameState) &&
      (this.isValidForwardMove(move, gameState) ||
        this.isValidAttackingMove(move, gameState) ||
        this.isValidEnPassantMove(move, gameState))
    );
  }

  private doesMoveForward(move: Move, gameState: GameState): boolean {
    const piece = gameState.board.getPiece(move.from);
    if (piece === null) throw new ChessGameEngineError("Piece is null.");

    const doesMoveForwards =
      (piece.color === PlayerSideColour.white && move.rankDelta > 0) ||
      (piece.color === PlayerSideColour.black && move.rankDelta < 0);

    return doesMoveForwards;
  }

  private getAttackingCoordinates(
    from: Coordinates,
    color: PlayerSideColour,
    fileDelta: number
  ): Coordinates | null {
    const moveRankDelta = color === PlayerSideColour.white ? 1 : -1;
    return CoordinatesCalculator.tryAdd(from, fileDelta, moveRankDelta);
  }

  private hasValidPromotionOnlyIfLandingOnEndRow(
    move: Move,
    gameState: GameState
  ): boolean {
    const piece = gameState.board.getPiece(move.from);
    if (piece === null) throw new ChessGameEngineError("Piece is null");

    const isPromotion =
      (piece.color === PlayerSideColour.white && move.to.rank === 8) ||
      (piece.color === PlayerSideColour.black && move.to.rank === 1);

    if (!isPromotion) {
      return !move.hasPromotion;
    }

    // same as !move.hasPromotion but using this instead as it works as a type guard
    if (move.promoteTo === null) return false;

    const disallowedPromotionPieces = [
      Piece.WhiteKing,
      Piece.WhitePawn,
      Piece.BlackKing,
      Piece.BlackPawn
    ];
    if (disallowedPromotionPieces.includes(move.promoteTo)) return false;

    return piece.color === move.promoteTo.color;
  }

  private isValidAttackingMove(move: Move, gameState: GameState): boolean {
    const piece = gameState.board.getPiece(move.from);
    if (piece === null) throw new ChessGameEngineError("Piece is null");

    const leftAttackFileDelta = piece.color === PlayerSideColour.white ? -1 : 1;
    const rightAttackFileDelta = -leftAttackFileDelta;

    const isCaseValid = (fileDelta: number): boolean => {
      const potentialAttackCoordinates = this.getAttackingCoordinates(
        move.from,
        piece.color,
        fileDelta
      );
      if (potentialAttackCoordinates === null) return false;

      const pieceOnAttackCoordinates = gameState.board.getPiece(
        potentialAttackCoordinates
      );
      const targetFieldHasOppositeColorPiece =
        pieceOnAttackCoordinates != null &&
        pieceOnAttackCoordinates.color !== piece.color;

      return (
        move.to.referentialEquals(potentialAttackCoordinates) &&
        targetFieldHasOppositeColorPiece
      );
    };

    return (
      isCaseValid(leftAttackFileDelta) || isCaseValid(rightAttackFileDelta)
    );
  }

  private isValidEnPassantMove(move: Move, gameState: GameState): boolean {
    const piece = gameState.board.getPiece(move.from);
    if (piece === null) throw new ChessGameEngineError("Piece is null");

    const leftEnPassantCoordinates = this.getAttackingCoordinates(
      move.from,
      piece.color,
      -1
    );
    const rightEnPassantCoordinates = this.getAttackingCoordinates(
      move.from,
      piece.color,
      1
    );

    return (
      (move.to.referentialEquals(leftEnPassantCoordinates) ||
        move.to.referentialEquals(rightEnPassantCoordinates)) &&
      move.to.referentialEquals(gameState.enPassant)
    );
  }

  private isValidForwardMove(move: Move, gameState: GameState): boolean {
    const doesChangeFile = move.to.file !== move.from.file;
    if (doesChangeFile) return false;

    const piece = gameState.board.getPiece(move.from);
    if (piece === null) throw new ChessGameEngineError("Piece is null");

    const whiteInitialPawnRank = 2;
    const blackInitialPawnRank = 7;
    const isInitialField =
      (piece.color === PlayerSideColour.white &&
        move.from.rank === whiteInitialPawnRank) ||
      (piece.color === PlayerSideColour.black &&
        move.from.rank === blackInitialPawnRank);
    const traversalCoordinatesLimit = isInitialField ? 2 : 1;

    return PieceTraversal.canTraverse(
      move,
      gameState.board,
      false,
      traversalCoordinatesLimit
    );
  }

  private landsOnSquareWithEmptyOrOppositePiece(
    move: Move,
    gameState: GameState
  ): boolean {
    const piece = gameState.board.getPiece(move.from);
    if (piece === null) throw new ChessGameEngineError("Piece is null");

    const targetPiece = gameState.board.getPiece(move.to);
    if (targetPiece === null) return true;

    return piece.color !== targetPiece.color;
  }
}
