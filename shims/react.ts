import "https://unpkg.com/react@17/umd/react.production.min.js";
import type ReactType from "react";

const React: typeof ReactType = window.React;
export default React;
export const {
    useEffect,
    useState,
    useRef,
    createElement,
    forwardRef,
    useContext,
    useCallback,
    useLayoutEffect,
    useReducer,
    useMemo,
    useDebugValue,
    useImperativeHandle,
    lazy,
    Component,
    createContext,
    Children,
} = React;
