"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const React = require("react");
const server = require("react-dom/server");
const _interopDefaultLegacy = (e) => e && typeof e === "object" && "default" in e ? e : { default: e };
const React__default = /* @__PURE__ */ _interopDefaultLegacy(React);
const Content = () => {
  return /* @__PURE__ */ React__default.default.createElement(React__default.default.Fragment, null, "this is Content");
};
const App = () => {
  return /* @__PURE__ */ React__default.default.createElement(React__default.default.Fragment, null, "This is Home Page", /* @__PURE__ */ React__default.default.createElement(Content, null));
};
function render() {
  return server.renderToString(
    /* @__PURE__ */ React__default.default.createElement(App, null)
  );
}
exports.render = render;
