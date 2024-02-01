import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import React from "react";
const Content = () => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, "this is Content");
};
const App = () => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, "This is Home Page", /* @__PURE__ */ React.createElement(Content, null));
};
const renderInBrowser = async () => {
  const rootEl = document.querySelector("#root");
  if (!rootEl) {
    throw new Error("#root element not found");
  }
  createRoot(rootEl).render(
    /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(App, null))
  );
};
renderInBrowser();
