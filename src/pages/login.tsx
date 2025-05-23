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

const LoginPage = () => {
  const { theme } = useThemeStore();
  const { login, isLoading, error } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في متجر لاتيكيا",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto">
          <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            تسجيل الدخول
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              ليس لديك حساب؟{" "}
              <button
                onClick={() => navigate("/register")}
                className={`${
                  theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                } font-medium`}
              >
                إنشاء حساب جديد
              </button>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;