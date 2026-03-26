"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileHeader({ user, followersCount, followingCount, onFollowersClick, onFollowingClick }: any) {
    return (
        <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="flex flex-col items-center">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                        {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="mt-3 text-xl font-semibold">
                    {user.name}
                </div>

                {user.bio && (
                    <p className="text-sm text-muted-foreground mt-1">
                        {user.bio}
                    </p>
                )}

                <div className="flex gap-10 mt-4">
                    <div onClick={onFollowersClick} className="cursor-pointer text-center">
                        <div className="font-semibold">{followersCount}</div>
                        <div className="text-xs">Followers</div>
                    </div>
                    <div onClick={onFollowingClick} className="cursor-pointer text-center">
                        <div className="font-semibold">{followingCount}</div>
                        <div className="text-xs">Following</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}