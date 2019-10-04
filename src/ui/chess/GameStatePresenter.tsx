import * as React from "react";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Row } from "reactstrap";
import Game from "../../model/chess/Game";
import HumanPlayer from "../../model/chess/players/HumanPlayer";
import Player from "../../model/chess/players/Player";
import ChessboardPresenter from "./ChessboardPresenter";
import Piece from "../../model/chess/Piece";
import Move from "../../model/chess/Move";
import GameState from "../../model/chess/GameState";
import PlayerSideColour from "../../model/chess/PlayerSideColour";
import Chessboard from "../../model/chess/chessboard/Chessboard";
import UndoMoveButton from "./UndoMoveButton";
import StockfishPlayer from "../../infrastructure/stockfish/StockfishPlayer";
import PromotionPiecePicker from "./PromotionPiecePicker";
import Coordinates from "../../model/chess/chessboard/Coordinates";

interface GameStatePresenterProps {
  game: Game;
}

const GameStatePresenter: React.FC<GameStatePresenterProps> = ({ game }) => {
  const [currentStatus, setCurrentStatus] = useState(game.getCurrentStatus());
  const [currentGameState, setCurrentGameState] = useState(
    game.getCurrentState()
  );
  const [currentPlayer, setCurrentPlayer] = useState(game.getCurrentPlayer());
  useEffect(() => {
    game.subscribeMoveProcessed(() => {
      setCurrentGameState(game.getCurrentState());
      setCurrentStatus(game.getCurrentStatus());
      setCurrentPlayer(game.getCurrentPlayer());
    });
  }, [game]);

  const {
    pickPromotionCallback,
    handleSquareSelected,
    savedSquareCoordinates
  } = useHandlePlayerSquareSelection(
    currentGameState,
    currentPlayer,
    (move, gameState) => game.ruleEngine.isMoveValid(move, gameState)
  );

  const reverseBoardInitial =
    !(game.playerWhite instanceof HumanPlayer) &&
    game.playerBlack instanceof HumanPlayer;
  const [isBoardReversed, setIsBoardReversed] = useState(reverseBoardInitial);

  const getPieceLegalMoveCoordinates = (
    from: Coordinates | null
  ): Coordinates[] => {
    const result: Coordinates[] = [];

    if (from === null) return result;
    const piece = currentGameState.board.getPiece(from);

    const isMoveToPromotion = (to: Coordinates, piece: Piece | null) => {
      return (
        (piece !== null && (piece === Piece.WhitePawn && to.rank === 8)) ||
        (piece === Piece.BlackPawn && to.rank === 1)
      );
    };

    for (let to of Chessboard.allCoordinates) {
      // needs to consider that move will be legal after a player chooses a promotion piece
      const surrogatePromoteTo =
        currentGameState.currentColor === PlayerSideColour.white
          ? Piece.WhiteQueen
          : Piece.BlackQueen;
      const move = isMoveToPromotion(to, piece)
        ? new Move(from, to, surrogatePromoteTo)
        : new Move(from, to);

      if (game.ruleEngine.isMoveValid(move, currentGameState)) result.push(to);
    }

    return result;
  };

  const title =
    game.playerWhite instanceof StockfishPlayer &&
    game.playerBlack instanceof StockfishPlayer
      ? "it's a fish fight!"
      : "shall we play?";

  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <h1>{title}</h1>
            <h5>status: {currentStatus}</h5>
            <ButtonGroup>
              <UndoMoveButton
                currentPlayer={game.getCurrentPlayer()}
                players={[game.playerWhite, game.playerBlack]}
                currentStatus={game.getCurrentStatus()}
              />
              <Button onClick={() => setIsBoardReversed(!isBoardReversed)}>
                Reverse board
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            {pickPromotionCallback && (
              <PromotionPiecePicker
                color={currentGameState.currentColor}
                pickedPieceCallback={pickPromotionCallback}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <ChessboardPresenter
              chessboard={game.getCurrentState().board}
              reverseBoard={isBoardReversed}
              pieceLegalMoveCoordinates={getPieceLegalMoveCoordinates(
                savedSquareCoordinates
              )}
              selectedSquareCoordinates={savedSquareCoordinates}
              handleSquareSelected={handleSquareSelected}
            />
          </Col>
        </Row>
        <Row>
          <Col>Current turn: {game.getCurrentState().currentColor}</Col>
        </Row>
        <Row>
          <Col>FEN: {game.getCurrentState().fen}</Col>
        </Row>
      </Col>
    </Row>
  );
};

class HandleSquareSelectedHelper {
  static isEmptyFirstSelection(
    piece: Piece | null,
    savedSquareCoordinates: Coordinates | null
  ) {
    return (
      piece === null &&
      HandleSquareSelectedHelper.isSquareEmpty(savedSquareCoordinates)
    );
  }

  static isMoveToPromotion(coordinates: Coordinates, piece: Piece | null) {
    return (
      (piece !== null &&
        (piece === Piece.WhitePawn && coordinates.rank === 8)) ||
      (piece === Piece.BlackPawn && coordinates.rank === 1)
    );
  }

  static isNonHumanPlayer(player: Player) {
    return !(player instanceof HumanPlayer);
  }

  static isNonOwnPieceFirstSelection(
    piece: Piece | null,
    currentPlayerColor: PlayerSideColour,
    savedSquareCoordinates: Coordinates | null
  ) {
    return (
      piece !== null &&
      piece.color !== currentPlayerColor &&
      savedSquareCoordinates === null
    );
  }

  static isSquareEmpty(square: Coordinates | null): square is null {
    return square === null;
  }
}

const useHandlePlayerSquareSelection: (
  gameState: GameState,
  currentPlayer: Player,
  isMoveValid: (move: Move, gameState: GameState) => boolean
) => {
  handleSquareSelected: (coordinates: Coordinates) => void;
  savedSquareCoordinates: Coordinates | null;
  pickPromotionCallback: ((piece: Piece | null) => void) | null;
} = (gameState, currentPlayer) => {
  const [
    savedSquareCoordinates,
    setSavedSquareCoordinates
  ] = useState<Coordinates | null>(null);

  const [pickPromotionCallback, setPickPromotionCallback] = useState<
    ((piece: Piece | null) => void) | null
  >(null);
  const getAskForPromotionPieceCallback = (
    promotionMoveFrom: Coordinates,
    promotionMoveTo: Coordinates
  ) => (pickedPiece: Piece | null): void => {
    if (pickedPiece !== null)
      (currentPlayer as HumanPlayer).makeMove(
        new Move(promotionMoveFrom, promotionMoveTo, pickedPiece)
      );

    setSavedSquareCoordinates(null);
    setPickPromotionCallback(null);
  };

  const handleSquareSelected = (coordinates: Coordinates): void => {
    const piece = gameState.board.getPiece(coordinates);

    if (
      HandleSquareSelectedHelper.isNonHumanPlayer(currentPlayer) ||
      HandleSquareSelectedHelper.isEmptyFirstSelection(
        piece,
        savedSquareCoordinates
      ) ||
      HandleSquareSelectedHelper.isNonOwnPieceFirstSelection(
        piece,
        gameState.currentColor,
        savedSquareCoordinates
      )
    )
      return;

    if (HandleSquareSelectedHelper.isSquareEmpty(savedSquareCoordinates)) {
      setSavedSquareCoordinates(coordinates);
      return;
    }

    const isSelectedSquareSameAsSavedSelectedSquare = savedSquareCoordinates.referentialEquals(
      coordinates
    );
    if (isSelectedSquareSameAsSavedSelectedSquare) {
      setSavedSquareCoordinates(null);
      return;
    }

    const previouslySelectedPiece = gameState.board.getPiece(
      savedSquareCoordinates
    );
    if (
      HandleSquareSelectedHelper.isMoveToPromotion(
        coordinates,
        previouslySelectedPiece
      )
    ) {
      setPickPromotionCallback(() =>
        getAskForPromotionPieceCallback(savedSquareCoordinates, coordinates)
      );

      return;
    }

    (currentPlayer as HumanPlayer).makeMove(
      new Move(savedSquareCoordinates, coordinates)
    );
    setSavedSquareCoordinates(null);
  };

  return {
    handleSquareSelected,
    savedSquareCoordinates,
    pickPromotionCallback
  };
};

export default GameStatePresenter;
