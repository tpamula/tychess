import Player from "../../model/chess/players/Player";
import Move from "../../model/chess/Move";
import GameState from "../../model/chess/GameState";
import Piece, { pieceAlgebraicNotation } from "../../model/chess/Piece";
import PlayerSideColour from "../../model/chess/PlayerSideColour";
import Coordinates from "../../model/chess/chessboard/Coordinates";
import { isRank } from "../../model/chess/chessboard/Rank";
import { isFile } from "../../model/chess/chessboard/File";

export default class StockfishPlayer implements Player {
  private readonly _depth: number;
  private _stockfishWorker: Worker;

  constructor(depth = 1) {
    this._depth = depth;
    this._stockfishWorker = new Worker(
      `${process.env.PUBLIC_URL}/stockfish-worker/stockfish.js`
    );
  }

  async getMove({ currentColor, fen }: GameState): Promise<Move> {
    return new Promise(async resolve => {
      await this._stockfishWorker.postMessage(`position fen ${fen}`);
      this._stockfishWorker.postMessage(`go depth ${this._depth}`);

      this._stockfishWorker.onmessage = ev => {
        const message = ev.data;

        if (UciProtocolInterpreter.hasFoundBestMove(message)) {
          let move = this.getMoveFromMessage(currentColor, message);
          if (move !== null) resolve(move);
        }
      };
    });
  }

  private getMoveFromMessage(
    playerColor: PlayerSideColour,
    message: string
  ): Move | null {
    const regex = /bestmove (\w\d\w\d)(\w?)/;

    const result = regex.exec(message);

    if (result) {
      const promoteToOutput =
        result.length >= 2 && result[2] ? result[2] : null;

      let promoteToPiece = null;
      if (promoteToOutput !== null) {
        const promoteToOutputWithProperCasing =
          playerColor === PlayerSideColour.white
            ? promoteToOutput.toUpperCase()
            : promoteToOutput;

        promoteToPiece =
          promoteToOutput === null
            ? null
            : Piece.fromAlgebraicNotation(
                promoteToOutputWithProperCasing as pieceAlgebraicNotation
              );
      }

      const fromFile = result[1][0];
      const fromRank = parseInt(result[1][1], 10);

      if (!isFile(fromFile) || !isRank(fromRank))
        throw new Error(
          `Invalid from file/rank - file: ${fromFile} rank: ${fromRank}.`
        );

      const toFile = result[1][2];
      const toRank = parseInt(result[1][3], 10);

      if (!isFile(toFile) || !isRank(toRank))
        throw new Error(
          `Invalid to file/rank - file: ${toFile} rank: ${toRank}.`
        );

      const move = new Move(
        new Coordinates(fromFile, fromRank),
        new Coordinates(toFile, toRank),
        promoteToPiece
      );

      return move;
    }

    return null;
  }
}

class UciProtocolInterpreter {
  static hasFoundBestMove(message: string): boolean {
    const finishedProcessingRegex = /bestmove/;

    return finishedProcessingRegex.test(message);
  }
}
