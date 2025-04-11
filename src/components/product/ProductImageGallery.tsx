import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
        <img 
          src={images[currentImageIndex]} 
          alt={`Product image ${currentImageIndex + 1}`}
          className="w-full h-auto object-cover"
        />
      </Card>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? 'bg-blue-600 dark:bg-blue-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductImageGallery; 