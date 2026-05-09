import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewSection = ({ reviews, rating }) => {
  return (
    <div className="space-y-8 py-8 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          Customer Reviews
          <span className="text-sm font-medium bg-red-50 text-red-600 px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-red-600" />
            {rating || '4.5'}
          </span>
        </h3>
        <button className="text-red-600 font-bold hover:underline">Write a Review</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <motion.div 
              key={review._id} 
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                    {review.userId?.image ? (
                      <img src={review.userId.image} alt={review.userId.name} className="w-full h-full object-cover" />
                    ) : (
                      review.userId?.name?.[0] || 'U'
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.userId?.name || 'Anonymous'}</h4>
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-yellow-700">{review.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" /> Helpul?
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors">
                  <MessageSquare className="w-4 h-4" /> Reply
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
