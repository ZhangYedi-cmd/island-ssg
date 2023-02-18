"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const server_1 = require("react-dom/server");
const App_1 = require("./App");
// SSR入口
const render = () => (0, server_1.renderToString)((0, jsx_runtime_1.jsx)(App_1.App, {}));
exports.render = render;
console.log(exports.render);
