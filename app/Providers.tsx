"use client";

import * as Ably from "ably";
import { createContext, useReducer, Dispatch, useContext, useEffect, useState } from "react";
import { getMeAction, getAblyTokenAction } from "./actions/auth";
import { Chat, Message, UserPopulated } from "./types";


type State = {
    user: UserPopulated | null;
    messages: Message[];
    oppenedChatId: string
};

type Action =
    | { type: "setUser"; payload: UserPopulated | null }
    | { type: "setMessages"; payload: Message[] }
    | { type: "addMessage"; payload: Message }
    | { type: "clearMessages" }
    | { type: "addChat", payload: Chat }
    | { type: "setOpenedChatId", payload: string };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "setUser":
            return { ...state, user: action.payload };
        case "addChat":
            if (!state.user) return state;
            const chat = action.payload;

            const participant = chat.participants.find(
                (p) => p.userId === state.user?.id
            );

            return {
                ...state,
                user: {
                    ...state.user,
                    participant: [
                        ...state.user.participant,
                        {
                            ...participant!,
                            chat,
                        }
                    ],
                },
            };
        case "setMessages":
            return {
                ...state,
                messages: action.payload,
            };

        case "addMessage":
            if (state.oppenedChatId == action.payload.chatId) {
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
        case "setOpenedChatId":
            return {
                ...state,
                oppenedChatId: action.payload
            }
        default:
            return state;
    }
}

export const AppContext = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: { user: null, messages: [], oppenedChatId: "" },
    dispatch: () => null,
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, {
        user: null,
        messages: [],
        oppenedChatId: "",
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