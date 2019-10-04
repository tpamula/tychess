import Player from "./players/Player";
import GameState, { GameStateHistory } from "./GameState";
import Move from "./Move";
import ChessRules from "./rules/ChessRules";
import PlayerSideColour from "./PlayerSideColour";
import Entity from "../seedwork/Entity";
import { UndoRequest } from "./UndoRequest";
import { ongoingGameStatuses } from "./GameStatus";
import HumanPlayer from "./players/HumanPlayer";
import ChessGameEngineError from "./ChessGameEngineError";

export default class Game implements Entity {
  private _gameStateHistory: GameStateHistory = [];
  private _moveProcessedSubscribers: (() => void)[] = [];

  constructor(
    initialPosition: GameState,
    readonly playerWhite: Player,
    readonly playerBlack: Player,
    readonly ruleEngine = new ChessRules()
  ) {
    this._gameStateHistory.push(initialPosition);

    this.startGame();
  }

  getCurrentPlayer(): Player {
    return this.getCurrentState().currentColor === PlayerSideColour.white
      ? this.playerWhite
      : this.playerBlack;
  }

  getCurrentState(): GameState {
    return this._gameStateHistory[this._gameStateHistory.length - 1];
  }

  getCurrentStatus() {
    return this.ruleEngine.getGameStatus(this._gameStateHistory);
  }

  subscribeMoveProcessed(observerCallback: () => void): void {
    this._moveProcessedSubscribers.push(observerCallback);
  }

  private awaitUndoRequestedAfterGameFinished(): Promise<void> {
    let requestPlayerMove = (player: Player, resolve: () => void) =>
      player.getMove(this.getCurrentState()).then(value => {
        if (value instanceof UndoRequest) resolve();
        else requestPlayerMove(player, resolve);
      });
    return new Promise(resolve => {
      if (this.playerWhite instanceof HumanPlayer)
        requestPlayerMove(this.playerWhite, resolve);
      if (this.playerBlack instanceof HumanPlayer)
        requestPlayerMove(this.playerBlack, resolve);
    });
  }

  private makeMoveIfValid(move: Move): void {
    const makeMoveIfValidWithoutNotifyMoveProcessed = () => {
      const currentPiece = this.getCurrentState().board.getPiece(move.from);

      if (currentPiece === null) return;

      const isMovingOtherPlayerPiece =
        currentPiece.color !== this.getCurrentState().currentColor;
      if (isMovingOtherPlayerPiece) return;

      if (!this.ruleEngine.isMoveValid(move, this.getCurrentState())) {
        if (!(this.getCurrentPlayer() instanceof HumanPlayer)) {
          throw new ChessGameEngineError(
            `Non-human player made an invalid move: ${move.toUciString()}.`
          );
        }
        return;
      }

      let afterMoveState = this.getCurrentState().afterMove(move);

      this._gameStateHistory = [...this._gameStateHistory, afterMoveState];
    };

    makeMoveIfValidWithoutNotifyMoveProcessed();
    this.notifyMoveProcessed();
  }

  private notifyMoveProcessed(): void {
    this._moveProcessedSubscribers.forEach(s => s());
  }

  private async startGame(): Promise<void> {
    while (true) {
      if (ongoingGameStatuses.includes(this.getCurrentStatus())) {
        let move = await this.getCurrentPlayer().getMove(
          this.getCurrentState()
        );

        if (move instanceof UndoRequest) this.undoFullMove();
        else this.makeMoveIfValid(move);
      } else {
        await this.awaitUndoRequestedAfterGameFinished();
        this.undoFullMove();
      }
    }
  }

  private undoFullMove(): void {
    const undoFullMoveWithoutNotifyMoveProcessed = () => {
      if (this._gameStateHistory.length <= 1) return;

      const fullMoveMoves = 2;
      // if it's the first move, undo only a single one
      const movesToGoBack =
        this._gameStateHistory.length <= fullMoveMoves ? 1 : 2;

      this._gameStateHistory = this._gameStateHistory.slice(
        0,
        this._gameStateHistory.length - movesToGoBack
      );

      return;
    };

    undoFullMoveWithoutNotifyMoveProcessed();
    this.notifyMoveProcessed();
  }
}
