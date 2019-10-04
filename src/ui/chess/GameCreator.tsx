import React, { FunctionComponent, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import Game from "../../model/chess/Game";
import GameStateSetup from "../../model/chess/GameStateSetup";
import HumanPlayer from "../../model/chess/players/HumanPlayer";
import GameStatePresenter from "./GameStatePresenter";
import StockfishPlayer from "../../infrastructure/stockfish/StockfishPlayer";
import { Formik } from "formik";

const GameCreator: FunctionComponent = () => {
  const [chessGame, setChessGame] = useState<Game | null>(null);

  return (
    <Row>
      <Col>
        {chessGame == null ? (
          <NewGameForm setChessGame={setChessGame} />
        ) : (
          <GameStatePresenter game={chessGame} />
        )}
      </Col>
    </Row>
  );
};

interface NewGameFormProps {
  setChessGame: (chessGame: Game | null) => void;
}

const NewGameForm: FunctionComponent<NewGameFormProps> = ({ setChessGame }) => {
  const stockfish = {
    name: "Stockfish",
    create: (depth: number) => new StockfishPlayer(depth)
  };
  const availablePlayers = [
    { name: "Human", create: (depth: number) => new HumanPlayer() },
    stockfish
  ];

  const shouldShowSlowProcessingAlert = (
    playerWhiteName: string,
    playerBlackName: string,
    playerWhiteAnalysisDepth: number,
    playerBlackAnalysisDepth: number
  ) => {
    const analysisDepthAlertThreshold = 15;

    return (
      (playerWhiteName === stockfish.name &&
        playerWhiteAnalysisDepth >= analysisDepthAlertThreshold) ||
      (playerBlackName === stockfish.name &&
        playerBlackAnalysisDepth >= analysisDepthAlertThreshold)
    );
  };

  return (
    <>
      <h1>Create a new game</h1>
      <Formik
        initialValues={{
          selectedPlayerWhite: availablePlayers[0].name,
          selectedPlayerBlack: availablePlayers[1].name,
          playerWhiteAnalysisDepth: 1,
          playerBlackAnalysisDepth: 1
        }}
        onSubmit={values => {
          const playerWhiteInstance = availablePlayers
            .find(ap => ap.name === values.selectedPlayerWhite)!
            .create(values.playerWhiteAnalysisDepth);
          const playerBlackInstance = availablePlayers
            .find(ap => ap.name === values.selectedPlayerBlack)!
            .create(values.playerBlackAnalysisDepth);

          setChessGame(
            new Game(
              GameStateSetup.defaultInitial,
              playerWhiteInstance,
              playerBlackInstance
            )
          );
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form>
            {shouldShowSlowProcessingAlert(
              values.selectedPlayerWhite,
              values.selectedPlayerBlack,
              values.playerWhiteAnalysisDepth,
              values.playerBlackAnalysisDepth
            ) && (
              <Alert color="dark">
                If you find it's taking too much time to process a move,
                consider lowering the analysis depth.
              </Alert>
            )}
            <FormGroup>
              <Label for="player-white">White</Label>
              <Input
                id="player-white"
                type="select"
                name="selectedPlayerWhite"
                onChange={handleChange}
                defaultValue={values.selectedPlayerWhite}
                data-testid="player-white-selector"
              >
                {availablePlayers.map(value => (
                  <option key={value.name}>{value.name}</option>
                ))}
              </Input>
            </FormGroup>
            {values.selectedPlayerWhite === stockfish.name && (
              <FormGroup>
                <Label for="playerWhiteAnalysisDepth">
                  Engine analysis depth
                </Label>
                <Input
                  type="number"
                  name="playerWhiteAnalysisDepth"
                  value={values.playerWhiteAnalysisDepth}
                  onChange={handleChange}
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label for="player-black">Black</Label>
              <Input
                id="player-black"
                type="select"
                name="selectedPlayerBlack"
                onChange={handleChange}
                defaultValue={values.selectedPlayerBlack}
                data-testid="player-black-selector"
              >
                {availablePlayers.map(value => (
                  <option key={value.name}>{value.name}</option>
                ))}
              </Input>
            </FormGroup>
            {values.selectedPlayerBlack === stockfish.name && (
              <FormGroup>
                <Label for="playerBlackAnalysisDepth">
                  Engine analysis depth
                </Label>
                <Input
                  type="number"
                  name="playerBlackAnalysisDepth"
                  value={values.playerBlackAnalysisDepth}
                  onChange={handleChange}
                />
              </FormGroup>
            )}
            <Button
              type="submit"
              color="primary"
              data-testid="submit"
              onClick={handleSubmit}
            >
              Go
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default GameCreator;
