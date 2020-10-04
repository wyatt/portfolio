import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import { Terminal } from "./components/terminal/TerminalContainer";
import "./index.css";

// Global State
import { Provider } from "jotai";

const Wrapper = () => {
  return (
    <React.StrictMode>
      <Provider>
        <Terminal />
      </Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));

serviceWorker.unregister();
