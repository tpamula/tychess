import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Layout from "./Layout";
import GameCreator from "./chess/GameCreator";

const App: React.FC = () => {
  return (
    <Layout>
      <GameCreator />
    </Layout>
  );
};

export default App;
