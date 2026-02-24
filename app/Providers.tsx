"use client";

import { createContext, useReducer, Dispatch } from "react";
import { User } from "./generated/prisma/client";
import { Toaster } from "@/components/ui/sonner";

type State = {
    user: User | null;
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
    state: { user: null },
    dispatch: () => null,
});

export default function Providers({
    children,
    initialUser,
}: {
    children: React.ReactNode;
    initialUser: User | null;
}) {
    const [state, dispatch] = useReducer(reducer, {
        user: initialUser,
    });

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <Toaster position="bottom-right" richColors />
            {children}
        </AppContext.Provider>
    );
}
