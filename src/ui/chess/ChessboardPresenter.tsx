import Chessboard from "../../model/chess/chessboard/Chessboard";
import * as React from "react";
import { Col, Row } from "reactstrap";
import Square from "./Square";
import "./ChessboardPresenter.css";
import Coordinates from "../../model/chess/chessboard/Coordinates";
import { files } from "../../model/chess/chessboard/File";
import { ranks } from "../../model/chess/chessboard/Rank";

export interface ChessboardPresenterProps {
  chessboard: Chessboard;
  handleSquareSelected: (coordinates: Coordinates) => void;
  pieceLegalMoveCoordinates: Coordinates[];
  reverseBoard: boolean;
  selectedSquareCoordinates: Coordinates | null;
}

const ChessboardPresenter = ({
  chessboard,
  reverseBoard,
  selectedSquareCoordinates,
  pieceLegalMoveCoordinates,
  handleSquareSelected
}: ChessboardPresenterProps) => {
  const ranksPresentation = reverseBoard ? [...ranks] : [...ranks].reverse();

  return (
    <Row>
      <Col>
        <div className="chessboard my-3" data-testid="chessboard">
          {ranksPresentation.map(rank => (
            <Row key={rank}>
              {files.map(file => {
                const coordinates = new Coordinates(file, rank);
                return (
                  <Square
                    key={`${file}${rank}`}
                    piece={chessboard.getPiece(new Coordinates(file, rank))}
                    file={file}
                    rank={rank}
                    isSelected={coordinates.referentialEquals(
                      selectedSquareCoordinates
                    )}
                    isLegalPieceMove={pieceLegalMoveCoordinates.some(lpc =>
                      lpc.referentialEquals(coordinates)
                    )}
                    handleSquareSelected={handleSquareSelected}
                  />
                );
              })}
            </Row>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default ChessboardPresenter;
