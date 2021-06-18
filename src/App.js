import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import User from "./components/User";
import Example from "./components/Example";
import Test from "./components/Test";
import End from "./components/End";
import Result from "./components/Result";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={User} />
          <Route exact path="/example" component={Example} />
          <Route exact path="/test" component={Test} />
          <Route exact path="/end" component={End} />
          <Route exact path="/result" component={Result} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
