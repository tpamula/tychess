import Player from "./Player";
import Move from "../Move";
import GameState from "../GameState";
import { UndoRequest } from "../UndoRequest";

export default class HumanPlayer implements Player {
  private _resolveGetMovePromise:
    | ((arg: Move | UndoRequest) => void)
    | null = null;

  async getMove(fen: GameState): Promise<Move | UndoRequest> {
    return new Promise(resolve => {
      this._resolveGetMovePromise = resolve;
    });
  }

  makeMove(move: Move): void {
    if (this._resolveGetMovePromise === null) return;

    this._resolveGetMovePromise(move);
    this._resolveGetMovePromise = null;
  }

  requestUndo(): void {
    if (this._resolveGetMovePromise === null) return;

    this._resolveGetMovePromise(new UndoRequest());
    this._resolveGetMovePromise = null;
  }
}
