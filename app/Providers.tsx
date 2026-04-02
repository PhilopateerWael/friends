"use client";

import * as Ably from "ably";
import { createContext, useReducer, Dispatch, useContext, useEffect, useState } from "react";
import { getMeAction, getAblyTokenAction } from "./actions/auth";
import { Block, Chat, Message, UserPopulated } from "./types";
import { Privacy } from "./generated/prisma/enums";


type State = {
    user: UserPopulated | null;
    messages: Message[];
};

type Action =
    | { type: "setUser"; payload: UserPopulated | null }
    | { type: "setMessages"; payload: Message[] }
    | { type: "addMessage"; payload: Message }
    | { type: "clearMessages" }
    | { type: "addFollow"; payload: UserPopulated["following"][0] }
    | { type: "removeFollow"; payload: string }
    | { type: "addBlock"; payload: Block }
    | { type: "removeBlock"; payload: string }
    | {
        type: "updateProfile";
        payload: {
            name?: string;
            bio?: string;
            privacy?: Privacy;
        }
    }
    | { type: "updateFollowers"; payload: UserPopulated["followers"] }
    | { type: "updateFollowings"; payload: UserPopulated["following"] }
    | { type: "addChat", payload: UserPopulated["participant"][0] };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "setUser":
            return { ...state, user: action.payload };

        case "addFollow":
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    following: [...state.user.following, action.payload],
                },
            };

        case "removeFollow":
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    following: state.user.following.filter(
                        (f) => f.followingId !== action.payload
                    ),
                },
            };

        case "addBlock":
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    blocks: [...state.user.blocks, action.payload],
                },
            };

        case "removeBlock":
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    blocks: state.user.blocks.filter(
                        (b) => b.blockedId !== action.payload
                    ),
                },
            };
        case "updateFollowers":
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    followers: action.payload,
                },
            };
        case "updateFollowings":
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    following: action.payload,
                },
            };

        case "updateProfile":
            if (!state.user) return state;
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                },
            };
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

        function setAbly(token: any, user: UserPopulated) {
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

            channel.subscribe("message", (msg) => {
                dispatch({ type: "addMessage", payload: msg.data });
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