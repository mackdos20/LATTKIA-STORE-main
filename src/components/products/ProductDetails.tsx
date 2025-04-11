import { useState } from 'react';
import Image from 'next/image';
import { FiHeart, FiShoppingCart, FiShare2, FiStar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  isNew?: boolean;
  discount?: number;
  rating: number;
  reviews: number;
  stock: number;
  specifications: {
    [key: string]: string;
  };
}

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const router = useRouter();

  const handleAddToCart = () => {
    // Add to cart logic here
    toast.success('تمت إضافة المنتج إلى السلة');
  };

  const handleAddToWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? 'تمت إزالة المنتج من المفضلة' : 'تمت إضافة المنتج إلى المفضلة');
  };

  const handleShare = () => {
    // Share logic here
    toast.success('تم نسخ رابط المنتج');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({product.reviews} تقييمات)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary-500">
              {product.discount ? (
                <>
                  <span className="line-through text-gray-400 mr-2">
                    {product.price.toFixed(2)} ريال
                  </span>
                  {(product.price * (1 - product.discount / 100)).toFixed(2)} ريال
                </>
              ) : (
                `${product.price.toFixed(2)} ريال`
              )}
            </span>
            {product.discount && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                {product.discount}% خصم
              </span>
            )}
            {product.isNew && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">جديد</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400">{product.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                +
              </button>
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {product.stock} متوفر في المخزون
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              <FiShoppingCart className="inline-block mr-2" />
              أضف إلى السلة
            </button>
            <button
              onClick={handleAddToWishlist}
              className={`p-3 rounded-lg ${
                isWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <FiHeart className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">المواصفات</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">منتجات مشابهة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 