import {createRoot} from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import React from "react";
import {App} from "./App";

const renderInBrowser = async () => {
    const rootEl = document.querySelector('#root')
    if (!rootEl) {
        throw new Error('#root element not found');
    }

   createRoot(rootEl).render(
       <BrowserRouter>
           <App />
       </BrowserRouter>
   )
}

renderInBrowser()
