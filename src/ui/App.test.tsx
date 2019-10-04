import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// Jest throws an exception when dealing with web workers. This can be bypassed with a mock.
// https://github.com/facebook/jest/issues/3449#issuecomment-298887984
jest.mock("../infrastructure/stockfish/StockfishPlayer");

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
