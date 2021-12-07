import { connectAuth } from "./connect-firebase-auth-compat";
import firebase from "firebase/compat/app";
import firebaseui from "firebaseui";
import { useEffect, useState } from "react";

const auth = connectAuth();

const ui = new firebaseui.auth.AuthUI(auth);

export const useFirebaseUI = () => {
    const [loginState, setLoginState] = useState<{
        user?: firebase.User;
        showLoginHeader?: boolean;
    }>({ user: null });
    useEffect(() => {
        auth.onAuthStateChanged(
            (user) => {
                if (user) {
                    setLoginState({ user });
                } else {
                    if (
                        !ui.isPendingRedirect() &&
                        document.querySelector("#firebaseui-auth-container")
                    ) {
                        setLoginState({ showLoginHeader: true });
                        ui.start("#firebaseui-auth-container", {
                            callbacks: {
                                signInSuccessWithAuthResult(
                                    authResult: any
                                ): boolean {
                                    setLoginState({ user: authResult.user });
                                    return true;
                                },
                            },
                            signInOptions: [
                                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                            ],
                            signInFlow: "popup",
                        });
                    }
                }
            },
            (error) => {
                console.error(error);
            }
        );
    }, [!loginState.user]);

    const signOutUser = () => {
        return auth
            .signOut()
            .then(() =>
                setLoginState({
                    user: null,
                    showLoginHeader: true,
                })
            )
            .catch((e) => console.error(e));
    };

    return [loginState, { signOutUser }] as const;
};
