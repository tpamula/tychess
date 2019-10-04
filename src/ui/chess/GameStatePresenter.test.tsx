import * as testing from "@testing-library/react";
import React from "react";
import GameStatePresenter from "./GameStatePresenter";
import Game from "../../model/chess/Game";
import GameState from "../../model/chess/GameState";
import HumanPlayer from "../../model/chess/players/HumanPlayer";
import "@testing-library/jest-dom/extend-expect";

describe("GameStatePresenter", () => {
  it.each<[string, string, boolean]>([
    ["empty square", "a1", false],
    ["own piece", "f3", true],
    ["other player piece", "f4", false]
  ])(
    "should set the first move square selection correctly: %s",
    (description, coordinatesString, expectedSelected) => {
      // arrange
      const gameState = GameState.fromFen(
        "8/2k5/8/5n2/6p1/5P2/8/2K5 w - - 0 1"
      );
      const game = new Game(gameState, new HumanPlayer(), new HumanPlayer());
      const { getByTestId } = testing.render(
        <GameStatePresenter game={game} />
      );
      const selectedSquare = getByTestId(
        `chessboard-square-${coordinatesString}`
      );

      // act
      selectedSquare.click();

      // assert
      if (expectedSelected) {
        expect(selectedSquare).toHaveClass("selected");
      } else {
        expect(selectedSquare).not.toHaveClass("selected");
      }
    }
  );

  it.each<[string, string]>([
    ["valid attack move", "g4"],
    ["valid non attack move", "f4"],
    ["invalid move", "f5"]
  ])(
    "should disable the square selection after a second move: %s",
    (description, coordinatesString) => {
      // arrange
      const gameState = GameState.fromFen(
        "8/2k5/8/5n2/6p1/5P2/8/2K5 w - - 0 1"
      );
      const game = new Game(gameState, new HumanPlayer(), new HumanPlayer());
      const { getByTestId } = testing.render(
        <GameStatePresenter game={game} />
      );
      const firstSquare = getByTestId(`chessboard-square-f4`);
      const selectedSquare = getByTestId(
        `chessboard-square-${coordinatesString}`
      );

      // act
      firstSquare.click();
      selectedSquare.click();

      // assert
      expect(firstSquare).not.toHaveClass("selected");
      expect(selectedSquare).not.toHaveClass("selected");
    }
  );

  it("should display the promotion picker on promotion", () => {
    // arrange
    const gameState = GameState.fromFen("8/2k2P2/8/5n2/6p1/8/8/2K5 w - - 0 1");
    const game = new Game(gameState, new HumanPlayer(), new HumanPlayer());
    const { getByTestId, queryByTestId } = testing.render(
      <GameStatePresenter game={game} />
    );

    // act
    const beforePromotionPiecePicker = queryByTestId("promotion-piece-picker");
    getByTestId("chessboard-square-f7").click();
    getByTestId("chessboard-square-f8").click();
    const afterPromotionPiecePicker = queryByTestId("promotion-piece-picker");

    // assert
    expect(beforePromotionPiecePicker).toBeNull();
    expect(afterPromotionPiecePicker).toBeVisible();
  });
});
