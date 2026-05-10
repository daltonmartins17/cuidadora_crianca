import React from "react";
import { Star } from "lucide-react";

const ReviewItem = ({ review }) => {
  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-900">
              {review.reviewerUser?.fullName}
            </h4>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {new Date(review.createdAt).toLocaleDateString("pt-PT")}
          </p>
          <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
          <p className="text-gray-700 text-sm">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
