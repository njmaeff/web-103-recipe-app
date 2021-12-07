import "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js";

const ReactDOM = window.ReactDOM;
export default ReactDOM;
export const {
    render,
    createPortal,
    findDOMNode,
    version,
    flushSync,
    hydrate,
    unmountComponentAtNode,
} = ReactDOM;
