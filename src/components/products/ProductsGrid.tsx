import { useState } from 'react';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: number;
}

interface ProductsGridProps {
  products: Product[];
  categories: string[];
}

export default function ProductsGrid({ products, categories }: ProductsGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products
    .filter((product) => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return a.isNew ? -1 : 1;
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters and Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <FiFilter className="w-5 h-5" />
            <span>تصفية</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="Grid view"
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="List view"
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'newest')}
          className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">الأحدث</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
          <h3 className="text-lg font-semibold mb-4">التصنيفات</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              الكل
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            لا توجد منتجات
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            لم يتم العثور على منتجات مطابقة لمعايير البحث
          </p>
        </div>
      )}
    </div>
  );
} 