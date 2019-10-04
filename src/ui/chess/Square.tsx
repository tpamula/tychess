import * as React from "react";
import Piece from "../../model/chess/Piece";
import "./Square.css";
import Coordinates from "../../model/chess/chessboard/Coordinates";
import File, { files } from "../../model/chess/chessboard/File";
import Rank, { ranks } from "../../model/chess/chessboard/Rank";

interface SquareProps {
  file: File;
  handleSquareSelected: (coordinates: Coordinates) => void;
  isLegalPieceMove: boolean;
  isSelected: boolean;
  piece: Piece | null;
  rank: Rank;
}

const Square: React.FC<SquareProps> = ({
  piece,
  file,
  rank,
  isSelected,
  isLegalPieceMove,
  handleSquareSelected
}) => {
  const emptyCharacter = "\u00A0";

  const getCalculatedClasses: () => string = () => {
    let classes = [];

    const isLightSquare = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 1;

    if (isLightSquare) classes.push("light");
    else classes.push("dark");

    if (isLegalPieceMove) classes.push("legal-piece-move");

    if (isSelected) classes.push("selected");

    return classes.join(" ");
  };
  return (
    <div
      className={
        "chessboard-square d-flex justify-content-center align-items-center " +
        getCalculatedClasses()
      }
      onClick={() => handleSquareSelected(new Coordinates(file, rank))}
      data-testid={`chessboard-square-${file}${rank}`}
    >
      <span>{piece ? piece.unicodeSymbol : emptyCharacter}</span>
    </div>
  );
};

export default Square;
