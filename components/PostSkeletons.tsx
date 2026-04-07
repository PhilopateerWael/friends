import { Card, CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'

const PostSkeletons = () => {
    return (
        [1, 2, 3].map((i) => (
            <Card key={i} className="w-full max-w-2xl mx-auto">
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>

                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-56 w-full" />
                </CardContent>
            </Card>
        ))
    )
}

export default PostSkeletons