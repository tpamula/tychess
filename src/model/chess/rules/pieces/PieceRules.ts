import Move from "../../Move";
import GameState from "../../GameState";
import Service from "../../../seedwork/Service";

export default interface PieceRules extends Service {
  isMoveValid(move: Move, gameState: GameState): boolean;
}
