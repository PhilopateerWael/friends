"use client";

import * as Ably from "ably";
import { createContext, useReducer, Dispatch, useContext, useEffect, useState } from "react";
import { Block, Follow, User } from "./generated/prisma/client";
import { getMeAction, getAblyTokenAction } from "./actions/auth";

export type UserWithRelations = User & {
    followers: (Follow & { follower: User })[];
    following: Follow[];
    blocks: Block[];
};

type State = {
    user: UserWithRelations | null;
};

type Action =
    | { type: "setUser"; payload: UserWithRelations | null }
    | { type: "addFollow"; payload: any }
    | { type: "removeFollow"; payload: string }
    | { type: "addBlock"; payload: any }
    | { type: "removeBlock"; payload: string }
    | {
        type: "updateProfile";
        payload: {
            name?: string;
            bio?: string;
            privacy?: any;
        }
    }
    | { type: "updateFollowers"; payload: any }
    | { type: "updateFollowings"; payload: any }

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
                        (f: any) => f.followingId !== action.payload
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
                        (b: any) => b.blockedId !== action.payload
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

        default:
            return state;
    }
}

export const AppContext = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: { user: null },
    dispatch: () => null,
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, { user: null });
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