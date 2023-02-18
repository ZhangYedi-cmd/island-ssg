import {renderToString} from "react-dom/server";
import {App} from "./App";

// SSR入口
// export const render = () => renderToString(<App/>)
export function render() {
  return renderToString(<App/>);
}

