import { useState } from 'react';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  discount?: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function ShoppingCart({ items, onUpdateQuantity, onRemoveItem }: ShoppingCartProps) {
  const router = useRouter();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    const price = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      // Implement checkout logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/checkout');
    } catch (error) {
      toast.error('حدث خطأ أثناء عملية الدفع');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">سلة المشتريات فارغة</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            قم بإضافة بعض المنتجات إلى سلة المشتريات
          </p>
          <button
            onClick={() => router.push('/products')}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سلة المشتريات</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-primary-500 font-bold">
                    {item.discount ? (
                      <>
                        <span className="line-through text-gray-400 mr-2">
                          {item.price.toFixed(2)} ريال
                        </span>
                        {(item.price * (1 - item.discount / 100)).toFixed(2)} ريال
                      </>
                    ) : (
                      `${item.price.toFixed(2)} ريال`
                    )}
                  </span>
                  {item.discount && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      {item.discount}% خصم
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">المجموع الفرعي</span>
                <span className="font-medium">{subtotal.toFixed(2)} ريال</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">رسوم الشحن</span>
                <span className="font-medium">
                  {shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} ريال`}
                </span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold">المجموع الكلي</span>
                  <span className="font-bold text-primary-500">{total.toFixed(2)} ريال</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="w-full bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckoutLoading ? 'جاري المعالجة...' : 'إتمام عملية الشراء'}
            </button>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              * الشحن مجاني للطلبات التي تزيد عن 200 ريال
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 