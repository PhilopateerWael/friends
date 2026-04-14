"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchUsersAction } from "@/app/actions/users"
import { User } from "@/app/generated/prisma/client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

const UsersSearch = ({ action, isAbsolute, actionLoading }: { action: (user: User) => void, isAbsolute?: boolean, actionLoading: boolean }) => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<User[]>([])
    const [focused, setFocused] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const q = query.trim()

        if (q === "") {
            setResults([])
            setLoading(false)
            return
        }

        setLoading(true)

        const timeout = setTimeout(async () => {
            const result = await searchUsersAction(q)
            setResults(result.data || [])
            setLoading(false)
        }, 500)

        return () => clearTimeout(timeout)
    }, [query])

    const q = query.trim()

    return (
        <div className="flex w-full max-w-2xl flex-col gap-2 relative">
                <InputGroup>
                <InputGroupInput
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                />
        <InputGroupAddon align="inline-start">
                <Search className="size-4 text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>

            {(focused || !isAbsolute) && (
                <div className={`flex absolute w-full z-10 ${isAbsolute ? 'absolute translate-y-10' : 'relative'}`}>
                    <ScrollArea className="absolute w-full bg-surface rounded-md shadow-lg p-2 max-h-64 border">
                        <div className="flex flex-col gap-2">
                            {
                                q === "" && (
                                    <div className="text-sm text-muted-foreground px-3 py-2 text-center">
                                        Start typing to search users
                                    </div>
                                )
                            }
                            {
                                q !== "" && loading && (
                                    <div className="text-sm text-muted-foreground px-3 py-2 text-center">
                                        Searching...
                                    </div>
                                )
                            }

                            {
                                q !== "" && !loading && results.length === 0 && (
                                    <div className="text-sm text-muted-foreground px-3 py-2 text-center">
                                        No users found
                                    </div>
                                )
                            }

                            {
                                q !== "" && !loading && results.length > 0 &&
                                results.map((user: User) => (
                                    <Button
                                        key={user.id}
                                        variant="secondary"
                                        className="w-full justify-start h-fit cursor-pointer"
                                        onClick={() => action(user)}
                                        disabled={actionLoading}
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.image} alt={user.name} />
                                            <AvatarFallback>
                                                {user.name}
                                            </AvatarFallback>
                                        </Avatar>

                                        <span className="truncate">{user.name}</span>
                                    </Button>
                                ))
                            }
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}

export default UsersSearch