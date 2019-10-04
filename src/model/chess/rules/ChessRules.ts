import Move from "../Move";
import GameState, { GameStateHistory } from "../GameState";
import PawnRules from "./pieces/PawnRules";
import BishopRules from "./pieces/BishopRules";
import RookRules from "./pieces/RookRules";
import QueenRules from "./pieces/QueenRules";
import KingRules from "./pieces/KingRules";
import KnightRules from "./pieces/KnightRules";
import Piece from "../Piece";
import PlayerSideColour from "../PlayerSideColour";
import Chessboard from "../chessboard/Chessboard";
import GameStatus from "../GameStatus";
import ChessGameEngineError from "../ChessGameEngineError";
import Service from "../../seedwork/Service";
import Coordinates from "../chessboard/Coordinates";

export default class ChessRules implements Service {
  getGameStatus(gameStateHistory: GameStateHistory): GameStatus {
    if (gameStateHistory.length === 0)
      throw new ChessGameEngineError("Empty game history");

    let currentGameState = gameStateHistory[gameStateHistory.length - 1];

    if (this.isCheckmate(currentGameState))
      return currentGameState.currentColor === PlayerSideColour.white
        ? GameStatus.checkmateBlackWon
        : GameStatus.checkmateWhiteWon;

    if (this.isStalemate(currentGameState)) return GameStatus.drawStalemate;

    if (this.isDraw50MoveRule(currentGameState))
      return GameStatus.draw50MoveRule;

    if (this.isDrawThreefoldRepetition(gameStateHistory))
      return GameStatus.drawThreefoldRepetition;

    if (this.isKingInCheck(currentGameState))
      return currentGameState.currentColor === PlayerSideColour.white
        ? GameStatus.ongoingWhiteKingInCheck
        : GameStatus.ongoingBlackKingInCheck;

    return GameStatus.ongoing;
  }

  isMoveValid(
    move: Move,
    gameState: GameState,
    checkIfKingSafe = true
  ): boolean {
    const piece = gameState.board.getPiece(move.from);

    if (piece === null) return false;

    let pieceRules = this.getPieceRules(piece);

    return (
      pieceRules.isMoveValid(move, gameState) &&
      (!checkIfKingSafe || !this.isKingInCheckAfterMove(move, gameState))
    );
  }

  isSquareAttacked(
    targetCoordinates: Coordinates,
    gameState: GameState,
    attackedByColor: PlayerSideColour
  ): boolean {
    for (let squareCoordinates of Chessboard.allCoordinates) {
      const piece = gameState.board.getPiece(squareCoordinates);
      if (piece && piece.color !== attackedByColor) continue;
      if (piece === null) continue;

      const attackingPieceMove = new Move(squareCoordinates, targetCoordinates);

      const potentialPromotion =
        piece.color === PlayerSideColour.white
          ? Piece.WhiteQueen
          : Piece.BlackQueen;
      const attackingPieceMoveWithPromotion = new Move(
        squareCoordinates,
        targetCoordinates,
        potentialPromotion
      );

      if (
        this.isMoveValid(attackingPieceMove, gameState, false) ||
        this.isMoveValid(attackingPieceMoveWithPromotion, gameState, false)
      ) {
        return true;
      }
    }

    return false;
  }

  private getPieceRules(piece: Piece) {
    switch (piece) {
      case Piece.WhitePawn:
      case Piece.BlackPawn:
        return new PawnRules();
      case Piece.WhiteBishop:
      case Piece.BlackBishop:
        return new BishopRules();
      case Piece.WhiteRook:
      case Piece.BlackRook:
        return new RookRules();
      case Piece.WhiteQueen:
      case Piece.BlackQueen:
        return new QueenRules();
      case Piece.WhiteKing:
      case Piece.BlackKing:
        return new KingRules();
      case Piece.WhiteKnight:
      case Piece.BlackKnight:
        return new KnightRules();
      default:
        throw new ChessGameEngineError("Invalid piece.");
    }
  }

  private canMoveAnyPiece(gameState: GameState) {
    const hasAnyMove = (from: Coordinates): boolean => {
      for (let coordinates of Chessboard.allCoordinates) {
        if (this.isMoveValid(new Move(from, coordinates), gameState)) {
          return true;
        }
      }

      return false;
    };

    for (let coordinates of Chessboard.allCoordinates) {
      let piece = gameState.board.getPiece(coordinates);

      if (piece === null || piece.color !== gameState.currentColor) continue;

      if (hasAnyMove(coordinates)) {
        return true;
      }
    }

    return false;
  }

  private isCheckmate(gameState: GameState): boolean {
    return this.isKingInCheck(gameState) && !this.canMoveAnyPiece(gameState);
  }

  private isDraw50MoveRule(gameState: GameState): boolean {
    return gameState.halfMoveClock === 100;
  }

  private isDrawThreefoldRepetition(
    gameStateHistory: GameStateHistory
  ): boolean {
    const fenToCount = gameStateHistory.reduce(
      (acc, gs) =>
        acc.set(gs.board.toFen(), (acc.get(gs.board.toFen()) || 0) + 1),
      new Map<string, number>()
    );
    return Array.from(fenToCount.values()).includes(3);
  }

  private isKingInCheck(gameState: GameState): boolean {
    const kingCoordinates = gameState.board.findPieceCoordinates(
      gameState.currentColor === PlayerSideColour.white
        ? Piece.WhiteKing
        : Piece.BlackKing
    )[0];

    const oppositeColor =
      gameState.currentColor === PlayerSideColour.white
        ? PlayerSideColour.black
        : PlayerSideColour.white;

    if (this.isSquareAttacked(kingCoordinates, gameState, oppositeColor))
      return true;

    return false;
  }

  private isKingInCheckAfterMove(move: Move, gameState: GameState): boolean {
    const afterMoveGameState = gameState.withBoard(
      gameState.board.withMove(move)
    );

    return this.isKingInCheck(afterMoveGameState);
  }

  private isStalemate(gameState: GameState): boolean {
    return !this.isKingInCheck(gameState) && !this.canMoveAnyPiece(gameState);
  }
}
