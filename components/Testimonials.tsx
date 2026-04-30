import { db } from "@repo/db";
import { reviews, users } from "@repo/db/schema";
import { desc, eq } from "drizzle-orm";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function Testimonials() {
    const fetchedReviews = await db
        .select({
            id: reviews.id,
            rating: reviews.rating,
            reviewText: reviews.reviewText,
            createdAt: reviews.createdAt,
            userName: users.name,
            userImage: users.image,
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.userId, users.id))
        .orderBy(desc(reviews.rating), desc(reviews.createdAt))
        .limit(5);

    if (!fetchedReviews || fetchedReviews.length === 0) {
        return null;
    }

    const getBentoClasses = (index: number) => {
        switch (index) {
            case 0:
                return "md:col-span-2 md:row-span-2 bg-gradient-to-br from-orange-500/10 to-white/[0.02] border-orange-500/20";
            case 1:
                return "md:col-span-1 md:row-span-1";
            case 2:
                return "md:col-span-1 md:row-span-1";
            case 3:
                return "md:col-span-2 md:row-span-1";
            case 4:
                return "md:col-span-1 md:row-span-1 bg-white/[0.03]";
            default:
                return "col-span-1 row-span-1";
        }
    };

    return (
        <section className="w-full py-24 bg-background relative overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-5 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Loved by Cricket Fans
                    </h2>
                    <p className="text-stone-400 max-w-xl mx-auto text-sm md:text-base">
                        Don't just take our word for it. Here is what the CricArena community has to say about their fantasy experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)] grid-flow-row-dense">
                    {fetchedReviews.map((review, index) => {
                        const isHero = index === 0;

                        return (
                            <div
                                key={review.id}
                                className={`border border-white/[0.05] p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-300 group ${getBentoClasses(index)}`}
                                style={{ backgroundColor: !isHero ? "rgba(255,255,255,0.02)" : undefined }}
                            >
                                <div>
                                    <Quote className={`mb-4 transition-colors ${isHero ? "w-10 h-10 text-orange-500/40" : "w-6 h-6 text-white/[0.1] group-hover:text-orange-500/30"}`} />

                                    <div className="flex items-center gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`${isHero ? "w-5 h-5" : "w-4 h-4"} ${star <= review.rating
                                                    ? "fill-orange-500 text-orange-500"
                                                    : "fill-white/10 text-transparent"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <p className={`text-stone-300 leading-relaxed mb-8 ${isHero ? "text-lg md:text-xl font-medium" : "text-sm"}`}>
                                        "{review.reviewText}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05] mt-auto">
                                    <div className={`${isHero ? "w-12 h-12" : "w-10 h-10"} rounded-full bg-stone-800 overflow-hidden flex items-center justify-center border border-white/10 shrink-0`}>
                                        {review.userImage ? (

                                            <Avatar className="w-20 h-20 border-2 border-orange-500/20 shrink-0">
                                                <AvatarFallback className="bg-orange-500/10 text-3xl font-black text-orange-400">
                                                    {review.userName?.charAt(0) || "U"}
                                                </AvatarFallback>
                                                <AvatarImage src={review.userImage || ""} />
                                            </Avatar>
                                        ) : (
                                            <span className={`${isHero ? "text-sm" : "text-xs"} font-bold text-white`}>
                                                {(review.userName || "A").charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-white ${isHero ? "text-base" : "text-sm"}`}>
                                            {review.userName || "Anonymous Fan"}
                                        </h4>
                                        <span className="text-[11px] text-stone-500 font-medium">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}