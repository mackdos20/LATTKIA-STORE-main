import { useEffect, useState, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Product } from "@/lib/db/models";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { format } from "date-fns";
import { ArrowLeft, ShoppingCart, Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// تحميل المكونات الكبيرة بشكل ديناميكي
const ProductImageGallery = lazy(() => import("@/components/product/ProductImageGallery"));
const ProductReviews = lazy(() => import("@/components/product/ProductReviews"));
const ProductDescription = lazy(() => import("@/components/product/ProductDescription"));

const ProductPage = () => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        const products = await api.getProducts();
        const foundProduct = products.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات المنتج",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 text-center">
          <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            المنتج غير موجود
          </h1>
          <p className="text-muted-foreground mb-8">
            لم يتم العثور على المنتج المطلوب
          </p>
          <Button 
            className={`${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_rgba(37,99,235,0.7)]' 
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-all duration-300`}
            onClick={() => window.history.back()}
          >
            العودة
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            className={`${
              theme === 'dark'
                ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            }`}
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5 ml-2" />
            العودة
          </Button>
          <h1 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            {product.name}
          </h1>
          <div className="w-24" /> {/* Placeholder for alignment */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ProductImageGallery images={product.images} />
          </Suspense>
          
          <div className="space-y-6">
            <Card className={`border ${
              theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                  تفاصيل المنتج
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1">{product.rating}</span>
                    </div>
                  </div>

                  <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                    <ProductDescription description={product.description} />
                  </Suspense>

                  <Button
                    className={`w-full ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_rgba(37,99,235,0.7)]'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } transition-all duration-300`}
                    onClick={() => {
                      // إضافة المنتج إلى السلة
                      toast({
                        title: "تمت الإضافة",
                        description: "تم إضافة المنتج إلى السلة بنجاح",
                      });
                    }}
                  >
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    أضف إلى السلة
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <ProductReviews reviews={product.reviews} />
            </Suspense>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductPage;