import { Container } from "@/components/ds";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryLoading() {
    return (
        <Container className="max-w-5xl">
            <Card>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <div key={i} className="relative">
                                <Skeleton className="w-full aspect-square rounded-lg" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Container>
    );
}
