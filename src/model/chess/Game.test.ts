import Game from "./Game";
import HumanPlayer from "./players/HumanPlayer";
import Move from "./Move";
import GameStateSetup from "./GameStateSetup";
import GameState from "./GameState";
import ChessRules from "./rules/ChessRules";
import PlayerSideColour from "./PlayerSideColour";

const getChessGameTestFixture = (
  initialGameState: GameState = GameStateSetup.defaultInitial,
  chessRuleEngine: ChessRules | undefined = undefined
) => {
  const playerWhite = new HumanPlayer();
  const playerBlack = new HumanPlayer();
  const chessGame = new Game(
    initialGameState,
    playerWhite,
    playerBlack,
    chessRuleEngine
  );

  let getPromiseThatResolvesWhenMoveProcessed = (): Promise<void> => {
    let resolveMoveProcessed: () => void;

    let moveProcessed = new Promise<void>(
      resolve => (resolveMoveProcessed = resolve)
    );
    chessGame.subscribeMoveProcessed(() => resolveMoveProcessed());

    return moveProcessed;
  };

  return {
    chessGame,
    playerWhite,
    playerBlack,
    getPromiseThatResolvesWhenMoveProcessed
  };
};

describe("Game", () => {
  it("should initialise with a provided state", () => {
    // arrange
    const { chessGame } = getChessGameTestFixture(
      GameStateSetup.defaultInitial
    );

    // act
    const state = chessGame.getCurrentState();

    // assert
    expect(state).toBe(GameStateSetup.defaultInitial);
  });

  it("should make a move", async () => {
    // arrange
    const {
      chessGame,
      playerWhite,
      getPromiseThatResolvesWhenMoveProcessed
    } = getChessGameTestFixture();
    const moveProcessed = getPromiseThatResolvesWhenMoveProcessed();
    const expected =
      "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 1 1";

    // act
    playerWhite.makeMove(Move.fromUciString("d2d4"));
    await moveProcessed;

    // assert
    expect(chessGame.getCurrentState().fen).toBe(expected);
  });

  it("should request next player move after a move has been made", async () => {
    // arrange
    const {
      chessGame,
      playerWhite,
      playerBlack,
      getPromiseThatResolvesWhenMoveProcessed
    } = getChessGameTestFixture();
    const moveProcessed = getPromiseThatResolvesWhenMoveProcessed();
    const playerBlackGetMoveSpy = jest.spyOn(playerBlack, "getMove");

    // act
    playerWhite.makeMove(Move.fromUciString("d2d4"));
    await moveProcessed;

    // assert
    expect(playerBlackGetMoveSpy).toHaveBeenCalled();
  });

  it("should allow undoing a move", async () => {
    // arrange
    const {
      chessGame,
      playerWhite,
      playerBlack,
      getPromiseThatResolvesWhenMoveProcessed
    } = getChessGameTestFixture(GameStateSetup.defaultInitial);
    let moveProcessed = getPromiseThatResolvesWhenMoveProcessed();

    playerWhite.makeMove(Move.fromUciString("d2d4"));
    await moveProcessed;
    moveProcessed = getPromiseThatResolvesWhenMoveProcessed();
    playerBlack.makeMove(Move.fromUciString("d7d5"));
    await moveProcessed;
    moveProcessed = getPromiseThatResolvesWhenMoveProcessed();

    // act
    playerWhite.requestUndo();
    await moveProcessed;
    const currentStateFen = chessGame.getCurrentState().fen;

    // assert
    expect(currentStateFen).toEqual(GameStateSetup.defaultInitial.fen);
  });

  it.each<[string, PlayerSideColour]>([
    ["in turn", PlayerSideColour.white],
    ["out of turn", PlayerSideColour.black]
  ])(
    "should allow undoing a move after the game has ended: %s",
    async (
      description: string,
      requestingUndoPlayerColor: PlayerSideColour
    ) => {
      // arrange
      const initialFen =
        "rnbqkbnr/ppppp1pp/5p2/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 100";
      const {
        chessGame,
        playerWhite,
        playerBlack,
        getPromiseThatResolvesWhenMoveProcessed
      } = getChessGameTestFixture(GameState.fromFen(initialFen));
      let moveProcessed = getPromiseThatResolvesWhenMoveProcessed();

      playerBlack.makeMove(Move.fromUciString("g7g5"));
      await moveProcessed;
      moveProcessed = getPromiseThatResolvesWhenMoveProcessed();
      playerWhite.makeMove(Move.fromUciString("d1h5")); // checkmate
      await moveProcessed;
      moveProcessed = getPromiseThatResolvesWhenMoveProcessed();

      // act
      if (requestingUndoPlayerColor === PlayerSideColour.white)
        playerWhite.requestUndo();
      else playerBlack.requestUndo();
      await moveProcessed;
      const currentStateFen = chessGame.getCurrentState().fen;

      // assert
      expect(currentStateFen).toEqual(initialFen);
    }
  );

  it.each<[boolean, string]>([[true, "d2d4"], [false, "d5d7"]])(
    "should request the next player move only if previous is valid %p",
    async (isMoveValid, moveUciString) => {
      // arrange
      const {
        chessGame,
        playerWhite,
        playerBlack,
        getPromiseThatResolvesWhenMoveProcessed
      } = getChessGameTestFixture(GameStateSetup.defaultInitial);

      const move = Move.fromUciString(moveUciString);

      const playerBlackMakeMoveSpy = jest.spyOn(playerBlack, "getMove");
      let moveProcessed = getPromiseThatResolvesWhenMoveProcessed();

      // act
      playerWhite.makeMove(move);
      await moveProcessed;

      // assert
      expect(playerBlackMakeMoveSpy.mock.calls.length).toEqual(
        isMoveValid ? 1 : 0
      );
    }
  );

  it("should reject a move with a piece color different from the current player's", async () => {
    // arrange
    const {
      chessGame,
      playerWhite,
      getPromiseThatResolvesWhenMoveProcessed
    } = getChessGameTestFixture(GameStateSetup.defaultInitial);
    const moveProcessed = getPromiseThatResolvesWhenMoveProcessed();

    // act
    playerWhite.makeMove(Move.fromUciString("d7d5"));
    await moveProcessed;

    // assert
    expect(chessGame.getCurrentState().fen).toBe(
      GameStateSetup.defaultInitial.fen
    );
  });
});
