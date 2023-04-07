"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const server = require("react-dom/server");
const jsxRuntime = require("react/jsx-runtime");
const reactRouter = require("react-router");
require("react");
const router = require("@remix-run/router");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const jsxRuntime__namespace = /* @__PURE__ */ _interopNamespace(jsxRuntime);
const jsx = jsxRuntime__namespace.jsx;
const jsxs = jsxRuntime__namespace.jsxs;
const A = () => {
  return /* @__PURE__ */ jsx("div", {
    children: "hello b!"
  });
};
const B = () => {
  return /* @__PURE__ */ jsx("div", {
    children: "hello b!"
  });
};
const routes = [{
  path: "/guide/a",
  element: /* @__PURE__ */ jsx(A, {})
}, {
  path: "/b",
  element: /* @__PURE__ */ jsx(B, {})
}];
const Content = () => {
  const routeElement = reactRouter.useRoutes(routes);
  return routeElement;
};
function Layout() {
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx("h1", {
      children: "Content"
    }), /* @__PURE__ */ jsx(Content, {})]
  });
}
function App() {
  return /* @__PURE__ */ jsx(Layout, {});
}
function StaticRouter({
  basename,
  children,
  location: locationProp = "/"
}) {
  if (typeof locationProp === "string") {
    locationProp = reactRouter.parsePath(locationProp);
  }
  let action = router.Action.Pop;
  let location = {
    pathname: locationProp.pathname || "/",
    search: locationProp.search || "",
    hash: locationProp.hash || "",
    state: locationProp.state || null,
    key: locationProp.key || "default"
  };
  let staticNavigator = getStatelessNavigator();
  return /* @__PURE__ */ jsx(reactRouter.Router, {
    basename,
    children,
    location,
    navigationType: action,
    navigator: staticNavigator,
    static: true
  });
}
function getStatelessNavigator() {
  return {
    createHref(to) {
      return typeof to === "string" ? to : reactRouter.createPath(to);
    },
    push(to) {
      throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
    },
    replace(to) {
      throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
    },
    go(delta) {
      throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
    },
    back() {
      throw new Error(`You cannot use navigator.back() on the server because it is a stateless environment.`);
    },
    forward() {
      throw new Error(`You cannot use navigator.forward() on the server because it is a stateless environment.`);
    }
  };
}
function render() {
  return server.renderToString(/* @__PURE__ */ jsx(StaticRouter, {
    location: "/guide/a",
    children: /* @__PURE__ */ jsx(App, {})
  }));
}
exports.render = render;
