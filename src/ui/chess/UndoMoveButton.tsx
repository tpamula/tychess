import Player from "../../model/chess/players/Player";
import GameStatus, { ongoingGameStatuses } from "../../model/chess/GameStatus";
import * as React from "react";
import HumanPlayer from "../../model/chess/players/HumanPlayer";
import { Button } from "reactstrap";

export interface UndoButtonProps {
  currentPlayer: Player;
  currentStatus: GameStatus;
  players: Player[];
}

export const UndoMoveButton: React.FC<UndoButtonProps> = ({
  currentPlayer,
  players,
  currentStatus
}) => {
  const gameHasEnded = !ongoingGameStatuses.includes(currentStatus);
  const anyPlayerIsHuman = players.some(p => p instanceof HumanPlayer);
  const currentPlayerIsHuman = currentPlayer instanceof HumanPlayer;
  const isUndoValid =
    currentPlayerIsHuman || (gameHasEnded && anyPlayerIsHuman);

  const handleUndo = () => {
    if (!isUndoValid) return;

    if (gameHasEnded && !currentPlayerIsHuman)
      (players.find(
        p => p instanceof HumanPlayer
      ) as HumanPlayer).requestUndo();
    else (currentPlayer as HumanPlayer).requestUndo();
  };

  return (
    <Button
      color="warning"
      onClick={handleUndo}
      disabled={!isUndoValid}
      data-testid="undo-move"
    >
      Undo move
    </Button>
  );
};

export default UndoMoveButton;
