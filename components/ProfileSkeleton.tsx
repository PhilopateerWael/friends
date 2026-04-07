import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const ProfileSkeleton = () => (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
        <Card>
            <CardContent className="flex flex-col items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
            </CardContent>
        </Card>
    </div>
);

export default ProfileSkeleton;