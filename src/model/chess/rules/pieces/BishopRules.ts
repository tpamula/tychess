import PieceRules from "./PieceRules";
import Move from "../../Move";
import GameState from "../../GameState";
import PieceTraversal from "./PieceTraversal";

export default class BishopRules implements PieceRules {
  isMoveValid(move: Move, gameState: GameState): boolean {
    return (
      !move.hasPromotion &&
      move.isDiagonal &&
      PieceTraversal.canTraverse(move, gameState.board, true)
    );
  }
}
