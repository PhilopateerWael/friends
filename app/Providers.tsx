"use client";

import * as Ably from "ably";
import { createContext, useReducer, Dispatch, useContext, useEffect, useState } from "react";
import { getMeAction, getAblyTokenAction } from "./actions/auth";
import { Message, UserPopulated } from "./types";


type State = {
    user: UserPopulated | null;
    messages: Message[];
};

type Action =
    | { type: "setUser"; payload: UserPopulated | null }
    | { type: "setMessages"; payload: Message[] }
    | { type: "addMessage"; payload: Message }
    | { type: "clearMessages" }
    | { type: "addChat", payload: UserPopulated["participant"][0] };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "setUser":
            return { ...state, user: action.payload };
        case "addChat":
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    participant: [
                        ...state.user.participant,
                        action.payload,
                    ],
                },
            };
        case "setMessages":
            return {
                ...state,
                messages: action.payload,
            };

        case "addMessage":
            if (state.messages.length && state.messages[0].chatId == action.payload.chatId) {
                return {
                    ...state,
                    messages: [...state.messages, action.payload],
                };
            }
            return state;

        case "clearMessages":
            return {
                ...state,
                messages: [],
            };
        default:
            return state;
    }
}

export const AppContext = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: { user: null, messages: [] },
    dispatch: () => null,
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        user: null,
        messages: [],
    }); const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            const { success, data } = await getMeAction();

            if (!success || !data) {
                setLoading(false);
                return;
            }

            const { user, token } = data

            dispatch({ type: "setUser", payload: user });

            if (user && token) {
                dispatch({ type: "setUser", payload: user });
                setAbly(token, user);
            }
            
            setLoading(false);
        }

        function setAbly(token: any, user: UserPopulated) {
            const client = new Ably.Realtime({
                tokenDetails: token,
                authCallback: async (tokenParams, callback) => {
                    try {
                        const newToken = await getAblyTokenAction();
                        callback(null, newToken.data);
                    } catch (error: any) {
                        callback(error, null);
                    }
                },
            });

            const channel = client.channels.get(`user-${user.id}`);

            channel.subscribe("message", (msg) => {
                dispatch({ type: "addMessage", payload: msg.data });
            });

            channel.subscribe("chat", (msg) => {
                dispatch({ type: "addChat", payload: msg.data });
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