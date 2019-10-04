import Move from "../../Move";
import GameState from "../../GameState";
import RookRules from "./RookRules";
import BishopRules from "./BishopRules";
import PieceRules from "./PieceRules";

export default class QueenRules implements PieceRules {
  isMoveValid(move: Move, gameState: GameState): boolean {
    return (
      new RookRules().isMoveValid(move, gameState) ||
      new BishopRules().isMoveValid(move, gameState)
    );
  }
}
