import React from "react";
import {PageTemplate} from "./components/pageTemplate";
import {css} from "@njmaeff/webpack-static-site/util/css";

export default () => (
    <PageTemplate
        title={"Recipe App"}
        extraTags={[
            <style>{css`
                root {
                    background-color: #f0f0f0;
                    color: #0f0f0f;
                }

                body {
                    max-width: 960px;
                    min-height: 100vh;

                    margin: 0 auto;

                    background-color: lightyellow;
                    color: #0f0f0f;
                }

                header {
                    text-align: center;
                    padding: 2rem;
                }

                main {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    margin: 0 5rem;
                }

                main section {
                    margin: 4rem 0;
                }

                div.login-container {
                    position: absolute;
                    top: 30%;
                    left: 50%;
                    transform: translate(-50%);
                }

                p.firebase-emulator-warning {
                    display: none !important;
                }

                article.card table * {
                    color: #f0f0f0;
                }
            `}</style>,
        ]}
    >
        <script type={"module"} src={'js/script.js'}/>
    </PageTemplate>
);
