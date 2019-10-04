import * as testing from "@testing-library/react";
import React from "react";
import UndoMoveButton from "./UndoMoveButton";
import "@testing-library/jest-dom/extend-expect";
import GameStatus from "../../model/chess/GameStatus";
import Player from "../../model/chess/players/Player";
import HumanPlayer from "../../model/chess/players/HumanPlayer";
import GameState from "../../model/chess/GameState";
import Move from "../../model/chess/Move";
import { UndoRequest } from "../../model/chess/UndoRequest";

class TestNonHumanPlayer implements Player {
  getMove(gameState: GameState): Promise<Move | UndoRequest> {
    throw new Error("Not implemented");
  }
}

describe("UndoMoveButton", () => {
  it.each<[string, Player, Player[], GameStatus, boolean]>([
    [
      "ongoing, current player human",
      new HumanPlayer(),
      [new HumanPlayer(), new HumanPlayer()],
      GameStatus.ongoing,
      true
    ],
    [
      "ongoing, current player non human",
      new TestNonHumanPlayer(),
      [new TestNonHumanPlayer(), new HumanPlayer()],
      GameStatus.ongoing,
      false
    ],
    [
      "game finished, one player human",
      new TestNonHumanPlayer(),
      [new TestNonHumanPlayer(), new HumanPlayer()],
      GameStatus.drawStalemate,
      true
    ],
    [
      "ongoing, none player human",
      new TestNonHumanPlayer(),
      [new TestNonHumanPlayer(), new TestNonHumanPlayer()],
      GameStatus.checkmateBlackWon,
      false
    ]
  ])(
    "should set disabled state correctly: %s",
    (
      description,
      currentPlayer,
      players,
      currentStatus,
      expectedToBeEnabled
    ) => {
      // arrange
      const { getByTestId } = testing.render(
        <UndoMoveButton
          currentPlayer={currentPlayer}
          players={players}
          currentStatus={currentStatus}
        />
      );

      // act
      const undoMoveButton = getByTestId("undo-move");

      // assert
      if (expectedToBeEnabled) {
        expect(undoMoveButton).toBeEnabled();
      } else {
        expect(undoMoveButton).toBeDisabled();
      }
    }
  );
});
