import PieceRules from "./PieceRules";
import Move from "../../Move";
import GameState from "../../GameState";
import PieceTraversal from "./PieceTraversal";

export default class RookRules implements PieceRules {
  isMoveValid(move: Move, gameState: GameState): boolean {
    return (
      !move.hasPromotion &&
      move.isHorizontalOrVertical &&
      PieceTraversal.canTraverse(move, gameState.board, true)
    );
  }
}
