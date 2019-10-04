import GameState from "./GameState";
import FenSetup from "./FenSetup";

export default class GameStateSetup {
  static defaultInitial = GameState.fromFen(FenSetup.defaultInitial);

  static empty = GameState.fromFen(FenSetup.empty);
}
