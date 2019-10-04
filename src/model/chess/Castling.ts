import Move from "./Move";
import PlayerSideColour from "./PlayerSideColour";
import Service from "../seedwork/Service";
import Piece from "./Piece";
import ChessGameEngineError from "./ChessGameEngineError";
import Coordinates from "./chessboard/Coordinates";

enum Castling {
  whiteKingside = "K",
  whiteQueenside = "Q",
  blackKingside = "k",
  blackQueenside = "q"
}

export default Castling;

export class CastlingService implements Service {
  static castlingToMoves(castling: Castling): Move[] {
    switch (castling) {
      case Castling.whiteKingside:
        return [Move.fromUciString("e1g1"), Move.fromUciString("h1f1")];
      case Castling.whiteQueenside:
        return [Move.fromUciString("e1c1"), Move.fromUciString("a1d1")];
      case Castling.blackKingside:
        return [Move.fromUciString("e8g8"), Move.fromUciString("h8f8")];
      case Castling.blackQueenside:
        return [Move.fromUciString("e8c8"), Move.fromUciString("a8d8")];
    }
  }

  static getCastlingColor(castling: Castling): PlayerSideColour {
    switch (castling) {
      case Castling.whiteKingside:
      case Castling.whiteQueenside:
        return PlayerSideColour.white;
      case Castling.blackKingside:
      case Castling.blackQueenside:
        return PlayerSideColour.black;
      default:
        throw new ChessGameEngineError("Invalid castling.");
    }
  }

  static getCastlingKingCoordinates(castling: Castling): Coordinates {
    let kingCoordinates: Coordinates;

    switch (castling) {
      case Castling.whiteKingside:
      case Castling.whiteQueenside:
        kingCoordinates = Coordinates.fromAlgebraicNotation("e1");
        break;
      case Castling.blackKingside:
      case Castling.blackQueenside:
        kingCoordinates = Coordinates.fromAlgebraicNotation("e8");
        break;
      default:
        throw new ChessGameEngineError("Invalid castling.");
    }

    return kingCoordinates;
  }

  static getCastlingRookCoordinates(castling: Castling): Coordinates {
    let castlingRookCoordinates: Coordinates;

    switch (castling) {
      case Castling.whiteKingside:
        castlingRookCoordinates = Coordinates.fromAlgebraicNotation("h1");
        break;
      case Castling.whiteQueenside:
        castlingRookCoordinates = Coordinates.fromAlgebraicNotation("a1");
        break;
      case Castling.blackKingside:
        castlingRookCoordinates = Coordinates.fromAlgebraicNotation("h8");
        break;
      case Castling.blackQueenside:
        castlingRookCoordinates = Coordinates.fromAlgebraicNotation("a8");
        break;
      default:
        throw new ChessGameEngineError("Invalid castling.");
    }

    return castlingRookCoordinates;
  }

  static isCastling(piece: Piece, move: Move): boolean {
    let matchingCastling = CastlingService.kingMoveToCastling(move);

    switch (matchingCastling) {
      case Castling.whiteKingside:
      case Castling.whiteQueenside:
        return piece === Piece.WhiteKing;
      case Castling.blackKingside:
      case Castling.blackQueenside:
        return piece === Piece.BlackKing;
      default:
        return false;
    }
  }

  static kingMoveToCastling(move: Move): Castling | null {
    switch (move.toUciString()) {
      case "e1g1":
        return Castling.whiteKingside;
      case "e1c1":
        return Castling.whiteQueenside;
      case "e8g8":
        return Castling.blackKingside;
      case "e8c8":
        return Castling.blackQueenside;
      default:
        return null;
    }
  }
}
