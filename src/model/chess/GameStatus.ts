enum GameStatus {
  ongoing = "ongoing",
  ongoingWhiteKingInCheck = "ongoing, white king in check",
  ongoingBlackKingInCheck = "ongoing, black king in check",
  checkmateWhiteWon = "checkmate, white won",
  checkmateBlackWon = "checkmate, black won",
  drawStalemate = "draw, stalemate",
  drawThreefoldRepetition = "draw, threefold repetition",
  draw50MoveRule = "draw, 50 move rule"
}

// TODO TPX draw not enough material

export const ongoingGameStatuses = [
  GameStatus.ongoing,
  GameStatus.ongoingWhiteKingInCheck,
  GameStatus.ongoingBlackKingInCheck
];

export default GameStatus;
