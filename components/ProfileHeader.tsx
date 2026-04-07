import { User } from "@/app/generated/prisma/browser";
import UsersListModal from "./UsersListModal";
import { Card, CardContent } from "./ui/card";
import { AvatarImage, Avatar, AvatarFallback } from "./ui/avatar";

export default function ProfileHeader({
    user,
    followersList,
    follwingList,
}: {
    user: User;
    followersList: User[];
    follwingList: User[];
}) {
    
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

                    <UsersListModal
                        title="Followers"
                        users={followersList}
                    >
                        <div className="cursor-pointer text-center">
                            <div className="font-semibold">
                                {followersList.length}
                            </div>
                            <div className="text-xs">Followers</div>
                        </div>
                    </UsersListModal>

                    <UsersListModal
                        title="Following"
                        users={follwingList}
                    >
                        <div className="cursor-pointer text-center">
                            <div className="font-semibold">
                                {follwingList.length}
                            </div>
                            <div className="text-xs">Following</div>
                        </div>
                    </UsersListModal >

                </div>
            </CardContent>
        </Card >
    );
}