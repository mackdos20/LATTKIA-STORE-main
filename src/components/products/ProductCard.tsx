import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  isNew = false,
  discount = 0,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    toast.success('تمت إضافة المنتج إلى السلة');
  };

  const handleAddToWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(
      isWishlist ? 'تمت إزالة المنتج من المفضلة' : 'تمت إضافة المنتج إلى المفضلة'
    );
  };

  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              جديد
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {discount}% خصم
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="bg-white p-2 rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-300"
            aria-label="Add to cart"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddToWishlist}
            className={`p-2 rounded-full transition-colors duration-300 ${
              isWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white hover:bg-primary-500 hover:text-white'
            }`}
            aria-label="Add to wishlist"
          >
            <FiHeart className="w-5 h-5" />
          </button>
          <Link
            href={`/products/${id}`}
            className="bg-white p-2 rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-300"
            aria-label="View product"
          >
            <FiEye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link
          href={`/categories/${category}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
        >
          {category}
        </Link>
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-1 mb-2 hover:text-primary-500 dark:hover:text-primary-400 line-clamp-2">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-500">
              {discountedPrice.toLocaleString('ar-SA', {
                style: 'currency',
                currency: 'SAR',
              })}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {price.toLocaleString('ar-SA', {
                  style: 'currency',
                  currency: 'SAR',
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 