import React from "react";
import ReactDOM from "react-dom";
import App from "./ui/App";
import * as serviceWorker from "./infrastructure/serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app validTo work offline and load faster, you can change
// unregister() validTo register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
