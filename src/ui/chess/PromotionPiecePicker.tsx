import React from "react";
import { Button, ButtonGroup, Col, Row } from "reactstrap";
import PlayerSideColour from "../../model/chess/PlayerSideColour";
import Piece from "../../model/chess/Piece";
import "./PromotionPiecePicker.css";

interface PromotionPiecePickerProps {
  color: PlayerSideColour;
  pickedPieceCallback: (piece: Piece | null) => void;
}

const PromotionPiecePicker: React.FC<PromotionPiecePickerProps> = ({
  color,
  pickedPieceCallback
}) => {
  const allowedPromotionPieceWhiteVariants = [
    Piece.WhiteQueen,
    Piece.WhiteRook,
    Piece.WhiteBishop,
    Piece.WhiteKnight
  ];

  const getPieceProperColor = (
    promotionPieceWhiteVariant: Piece,
    color: PlayerSideColour
  ) => {
    switch (promotionPieceWhiteVariant) {
      case Piece.WhiteQueen:
        return color === PlayerSideColour.white
          ? Piece.WhiteQueen
          : Piece.BlackQueen;
      case Piece.WhiteRook:
        return color === PlayerSideColour.white
          ? Piece.WhiteRook
          : Piece.BlackRook;
      case Piece.WhiteBishop:
        return color === PlayerSideColour.white
          ? Piece.WhiteBishop
          : Piece.BlackBishop;
      case Piece.WhiteKnight:
        return color === PlayerSideColour.white
          ? Piece.WhiteKnight
          : Piece.BlackKnight;
      default:
        throw new Error("Invalid promotion piece");
    }
  };

  return (
    <Row
      className="mt-3"
      data-testid="promotion-piece-picker"
      id="promotion-piece-picker"
    >
      <Col>
        Promote to:{" "}
        <ButtonGroup>
          {allowedPromotionPieceWhiteVariants.map(whitePromotionPiece => {
            const properColorPromotionPiece = getPieceProperColor(
              whitePromotionPiece,
              color
            );

            return (
              <Button
                key={properColorPromotionPiece.unicodeSymbol}
                color="success"
                outline
                onClick={() => pickedPieceCallback(properColorPromotionPiece)}
              >
                <span className="promotion-piece">
                  {properColorPromotionPiece.unicodeSymbol}
                </span>
              </Button>
            );
          })}
          <Button outline onClick={() => pickedPieceCallback(null)}>
            Cancel
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
};

export default PromotionPiecePicker;
