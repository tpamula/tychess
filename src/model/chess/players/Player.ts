import Move from "../Move";
import GameState from "../GameState";
import { UndoRequest } from "../UndoRequest";

export default interface Player {
  getMove(gameState: GameState): Promise<Move | UndoRequest>;
}
