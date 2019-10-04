import GameState from "../../GameState";
import PieceRules from "./PieceRules";
import Move from "../../Move";
import PlayerSideColour from "../../PlayerSideColour";
import Piece from "../../Piece";
import { files } from "../../chessboard/File";
import { ranks } from "../../chessboard/Rank";

export default class TestUtils {
  private static _blackValidPiecePromotions = [
    Piece.BlackRook,
    Piece.BlackKnight,
    Piece.BlackBishop,
    Piece.BlackQueen
  ];
  private static _whiteValidPiecePromotions = [
    Piece.WhiteRook,
    Piece.WhiteKnight,
    Piece.WhiteBishop,
    Piece.WhiteQueen
  ];

  static createExpectedAppendingPromotionsToMoves(
    from: string,
    to: Set<string>,
    pieceColor: PlayerSideColour,
    appendValidPiecePromotionsTo: Set<string>
  ): Set<string> {
    const result = new Set<string>();

    to.forEach(t => {
      const move = from + t;
      if (appendValidPiecePromotionsTo.has(t)) {
        if (pieceColor === PlayerSideColour.white)
          this._whiteValidPiecePromotions.forEach(vpp =>
            result.add(move + vpp.algebraicNotation)
          );
        else
          this._blackValidPiecePromotions.forEach(vpp =>
            result.add(move + vpp.algebraicNotation)
          );
      } else {
        result.add(move);
      }
    });

    return result;
  }

  static getAllAllowedMoves(
    pieceRules: PieceRules,
    gameState: GameState,
    uciFrom: string
  ): Set<string> {
    const allowedMoves = new Set<string>();
    for (const file of files) {
      for (const rank of ranks) {
        const promotionsUciString = [
          "",
          ...this._whiteValidPiecePromotions.map(p => p.algebraicNotation),
          ...this._blackValidPiecePromotions.map(p => p.algebraicNotation)
        ];
        for (const promotionUciString of promotionsUciString) {
          const uciString = uciFrom + file + rank + promotionUciString;
          const move = Move.fromUciString(uciString);

          if (pieceRules.isMoveValid(move, gameState))
            allowedMoves.add(uciString);
        }
      }
    }

    return allowedMoves;
  }
}
