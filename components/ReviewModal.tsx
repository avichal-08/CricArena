"use client";

import { useState, useEffect, useTransition } from "react";
import { Star, X, Loader2, Send } from "lucide-react";
import { submitReviewAction } from "@/actions/Reviews";

export function ReviewModal({ needsReview }: { needsReview: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (needsReview) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [needsReview]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !reviewText.trim()) return;

    startTransition(async () => {
      const res = await submitReviewAction(rating, reviewText);
      if (res.success) {
        setIsOpen(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[oklch(0.12_0.01_38)] border border-white/[0.1] rounded-2xl w-full max-w-md flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
             How are you liking CricArena?
          </h2>
          <button 
            onClick={() => !isPending && setIsOpen(false)}
            disabled={isPending}
            className="p-1 text-stone-500 hover:text-white hover:bg-white/[0.1] rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-stone-400 font-medium">Rate your experience</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      (hoveredRating || rating) >= star 
                        ? "fill-orange-500 text-orange-500" 
                        : "text-stone-600"
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="review" className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Leave a Review
            </label>
            <textarea
              id="review"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.05] transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || !reviewText.trim() || isPending}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-orange-500/20"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Review
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}