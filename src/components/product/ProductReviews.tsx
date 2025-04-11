import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ProductReviewsProps {
  reviews: Review[];
}

const ProductReviews = ({ reviews }: ProductReviewsProps) => {
  if (reviews.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">التقييمات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            لا توجد تقييمات حتى الآن
          </p>
        </CardContent>
      </Card>
    );
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">التقييمات</CardTitle>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              ({reviews.length} تقييم)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="font-medium">{review.userName}</span>
                  <div className="flex items-center ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviews; 