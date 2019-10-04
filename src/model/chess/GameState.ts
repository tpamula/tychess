import ValueObject from "../seedwork/ValueObject";
import Chessboard from "./chessboard/Chessboard";
import PlayerSideColour from "./PlayerSideColour";
import Castling, { CastlingService } from "./Castling";
import Move from "./Move";
import Piece from "./Piece";
import ChessGameEngineError from "./ChessGameEngineError";
import Coordinates from "./chessboard/Coordinates";
import Rank from "./chessboard/Rank";

export type GameStateHistory = GameState[];

export default class GameState extends ValueObject<GameState> {
  private readonly _fen: string;

  private constructor(fen: string) {
    super();

    this._fen = fen;
  }

  private _board: Chessboard | undefined;

  get board(): Chessboard {
    return (this._board = this._board || Chessboard.fromFen(this._fen));
  }

  get castlings(): Castling[] {
    const castlingsString = this._fen.split(" ")[2];
    if (castlingsString === "-") return [];

    return castlingsString.split("").map(c => c as Castling);
  }

  get currentColor(): PlayerSideColour {
    let fenPlayerColor = this._fen.split(" ")[1];
    switch (fenPlayerColor) {
      case "w":
        return PlayerSideColour.white;
      case "b":
        return PlayerSideColour.black;
      default:
        throw new ChessGameEngineError("Invalid player color");
    }
  }

  get enPassant(): Coordinates | null {
    const enPassantString = this._fen.split(" ")[3];

    if (enPassantString === "-") return null;

    return Coordinates.fromAlgebraicNotation(enPassantString);
  }

  get fen(): string {
    return this._fen;
  }

  get fullMoveNumber(): number {
    return parseInt(this._fen.split(" ")[5]);
  }

  get halfMoveClock(): number {
    return parseInt(this._fen.split(" ")[4], 10);
  }

  static fromFen(fen: string): GameState {
    return new GameState(fen);
  }

  static fromParts(
    board: Chessboard,
    currentColor: PlayerSideColour,
    castlingsAvailable: Castling[],
    enPassantAvailable: Coordinates | null,
    halfMoveClock: number,
    fullMoveNumber: number
  ): GameState {
    const currentColorString =
      currentColor === PlayerSideColour.white ? "w" : "b";

    const castlingsString =
      castlingsAvailable.length === 0
        ? "-"
        : castlingsAvailable.sort().join("");

    const enPassantString =
      (enPassantAvailable && enPassantAvailable.toAlgebraicNotationString()) ||
      "-";

    return GameState.fromFen(
      `${board.toFen()} ${currentColorString} ${castlingsString} ${enPassantString} ${halfMoveClock} ${fullMoveNumber}`
    );
  }

  afterMove(move: Move): GameState {
    let boardAfterMove: Chessboard = this.getBoardAfterMove(move);

    const nextColor = this.getColorAfterMove();
    const castlingsAvailable = this.getCastlings(move);
    const enPassantAvailable = this.getEnPassantStateAfterMove(move);
    const halfMoveClock = this.getHalfMoveClockAfterMove(move);
    const fullMoveNumber = this.getFullMoveNumberAfterMove();

    return GameState.fromParts(
      boardAfterMove,
      nextColor,
      castlingsAvailable,
      enPassantAvailable,
      halfMoveClock,
      fullMoveNumber
    );
  }

  withBoard(board: Chessboard): GameState {
    return GameState.fromParts(
      board,
      this.currentColor,
      this.castlings,
      this.enPassant,
      this.halfMoveClock,
      this.fullMoveNumber
    );
  }

  private getBoardAfterMove(move: Move): Chessboard {
    let boardAfterMove: Chessboard = this.board;

    const piece = this.board.getPiece(move.from);
    if (piece === null) throw new ChessGameEngineError("Move from is null");

    if (CastlingService.isCastling(piece, move)) {
      const castlingMoves = CastlingService.castlingToMoves(
        CastlingService.kingMoveToCastling(move)!
      );
      for (const castlingMove of castlingMoves) {
        const piece = this.board.getPiece(castlingMove.from);

        boardAfterMove = boardAfterMove
          .withPiece(castlingMove.from, null)
          .withPiece(castlingMove.to, piece);
      }
    } else {
      const toFieldPiece = move.promoteTo || piece;

      boardAfterMove = boardAfterMove
        .withPiece(move.from, null)
        .withPiece(move.to, toFieldPiece);

      if (
        this.enPassant !== null &&
        move.to.referentialEquals(this.enPassant)
      ) {
        const pawnCapturedOnEnPassantRank: Rank =
          this.enPassant.rank === 3 ? 4 : 5;
        boardAfterMove = boardAfterMove.withPiece(
          new Coordinates(this.enPassant.file, pawnCapturedOnEnPassantRank),
          null
        );
      }
    }

    return boardAfterMove;
  }

  private getCastlings(move: Move): Castling[] {
    const castlingsAvailable = [];

    const isRookMoving = (castling: Castling): boolean => {
      const castlingRookCoordinates: Coordinates = CastlingService.getCastlingRookCoordinates(
        castling
      );

      return move.from.referentialEquals(castlingRookCoordinates);
    };

    const isKingInValidCastlingPosition = (castling: Castling): boolean => {
      switch (castling) {
        case Castling.whiteKingside:
        case Castling.whiteQueenside:
          const whiteKingPosition = this.board.findPieceCoordinates(
            Piece.WhiteKing
          )[0];

          return whiteKingPosition.referentialEquals(
            Coordinates.fromAlgebraicNotation("e1")
          );
        case Castling.blackKingside:
        case Castling.blackQueenside:
          const blackKingPosition = this.board.findPieceCoordinates(
            Piece.BlackKing
          )[0];

          return blackKingPosition.referentialEquals(
            Coordinates.fromAlgebraicNotation("e8")
          );
        default:
          throw new ChessGameEngineError("Invalid castling.");
      }
    };

    const isRookInValidCastlingPosition = (castling: Castling): boolean => {
      const rookPosition: Coordinates = CastlingService.getCastlingRookCoordinates(
        castling
      );

      const castlingColor: PlayerSideColour = CastlingService.getCastlingColor(
        castling
      );

      return castlingColor === PlayerSideColour.white
        ? this.board.getPiece(rookPosition) === Piece.WhiteRook
        : this.board.getPiece(rookPosition) === Piece.BlackRook;
    };

    const isKingMoving = (castling: Castling): boolean => {
      const kingPosition = CastlingService.getCastlingKingCoordinates(castling);

      return kingPosition.referentialEquals(move.from);
    };

    for (const castling of this.castlings) {
      if (
        isKingInValidCastlingPosition(castling) &&
        isRookInValidCastlingPosition(castling) &&
        !isKingMoving(castling) &&
        !isRookMoving(castling)
      )
        castlingsAvailable.push(castling);
    }

    return castlingsAvailable;
  }

  private getColorAfterMove() {
    return this.currentColor === PlayerSideColour.white
      ? PlayerSideColour.black
      : PlayerSideColour.white;
  }

  private getEnPassantStateAfterMove(move: Move): Coordinates | null {
    const isPawn = (): boolean => {
      const piece = this.board.getPiece(move.from);

      return (
        piece != null && [Piece.WhitePawn, Piece.BlackPawn].includes(piece)
      );
    };

    const movesBy2Squares = (): boolean => {
      return Math.abs(move.rankDelta) === 2;
    };

    const getEnPassantSquare = (): Coordinates => {
      const rank: Rank = move.from.rank === 2 ? 3 : 6;
      return new Coordinates(move.from.file, rank);
    };

    if (!isPawn()) return null;
    if (movesBy2Squares()) return getEnPassantSquare();
    return null;
  }

  private getFullMoveNumberAfterMove() {
    return this.currentColor === PlayerSideColour.black
      ? this.fullMoveNumber + 1
      : this.fullMoveNumber;
  }

  private getHalfMoveClockAfterMove(move: Move) {
    const isCapture = this.board.getPiece(move.to) !== null;

    return isCapture ? 0 : this.halfMoveClock + 1;
  }
}
