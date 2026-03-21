"use client";

import * as Ably from "ably";
import { createContext, useReducer, Dispatch, useContext, useEffect, useState } from "react";
import { User } from "./generated/prisma/client";
import { getMeAction, getAblyTokenAction } from "./actions/auth";

type State = {
    user: User | null;
    token: any | null;
};

type Action = { type: "setUser"; payload: User | null };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "setUser":
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

export const AppContext = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: { user: null, token: null },
    dispatch: () => null,
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { user: null, token: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const { user, token } = await getMeAction();
                dispatch({ type: "setUser", payload: user });

                if (user && token) {
                    dispatch({ type: "setUser", payload: user });
                    setAbly(token, user);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        }

        function setAbly(token: any, user: User) {
            const client = new Ably.Realtime({
                tokenDetails: token,
                authCallback: async (tokenParams, callback) => {
                    try {
                        const newToken = await getAblyTokenAction();
                        callback(null, newToken);
                    } catch (error: any) {
                        callback(error, null);
                    }
                },
            });

            const channel = client.channels.get(`user-${user.id}`);

            channel.subscribe("new_post", (msg) => {
                console.log("New post:", msg.data);
            });

            return () => client.close();
        }

        init();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}