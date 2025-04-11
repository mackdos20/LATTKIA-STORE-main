import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const RegisterPage = () => {
  const { theme } = useThemeStore();
  const { register, isLoading, error } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined
      });
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في متجر لاتيكيا",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto">
          <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            إنشاء حساب جديد
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right block">الاسم</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-right block">رقم الهاتف (اختياري)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right`}
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_rgba(37,99,235,0.7)]' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-all duration-300`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                'إنشاء حساب'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <button
                onClick={() => navigate("/login")}
                className={`${
                  theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                } font-medium`}
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage; 