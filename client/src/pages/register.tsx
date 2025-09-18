import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Shield, Eye, EyeOff, ArrowLeft, Lock, Mail, User, CheckCircle } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Registration Failed",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      toast({
        title: "Welcome to MindShield!",
        description: "Your account has been created successfully.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (password: string | any[]) => {
    if (password.length < 6) return { strength: 'weak', color: 'text-red-400', bg: 'bg-red-400' };
    if (password.length < 10) return { strength: 'medium', color: 'text-yellow-400', bg: 'bg-yellow-400' };
    return { strength: 'strong', color: 'text-green-400', bg: 'bg-green-400' };
  };

  const passwordCheck = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating Data Points */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-pink-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-ping delay-1500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              MindShield
            </span>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:text-blue-400 transition-colors"
            onClick={() => setLocation('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <div className="w-full max-w-2xl">
          <Card className="w-full bg-gray-800/50 backdrop-blur-sm border-gray-700/50 shadow-2xl">
          <CardHeader className="space-y-6 text-center pb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-4xl font-bold text-white">
                Join MindShield
              </CardTitle>
              <CardDescription className="text-gray-300 text-xl">
                Take control of your data and start earning
              </CardDescription>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Create your account and begin your journey to data ownership and privacy
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Registration Form */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Create Account</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white text-sm font-medium">
                        Username
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12"
                          data-testid="input-username"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12"
                          data-testid="input-email"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="pl-10 pr-12 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${passwordCheck.bg} ${
                                  passwordCheck.strength === 'weak' ? 'w-1/3' : 
                                  passwordCheck.strength === 'medium' ? 'w-2/3' : 'w-full'
                                }`}
                              />
                            </div>
                            <span className={`text-xs ${passwordCheck.color} capitalize`}>
                              {passwordCheck.strength}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="pl-10 pr-12 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 h-12"
                          data-testid="input-confirm-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {formData.confirmPassword && (
                        <div className="flex items-center space-x-2">
                          {formData.password === formData.confirmPassword ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-xs text-green-400">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 border-red-400" />
                              <span className="text-xs text-red-400">Passwords don't match</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Preview */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">What You'll Get</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Shield className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Complete Data Control</h4>
                        <p className="text-gray-400 text-sm">Own and control who accesses your personal data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Earn from Your Data</h4>
                        <p className="text-gray-400 text-sm">Get paid when companies use your data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Lock className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Blockchain Security</h4>
                        <p className="text-gray-400 text-sm">Immutable records ensure your privacy</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Mail className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Transparent Earnings</h4>
                        <p className="text-gray-400 text-sm">See exactly how much you earn and from whom</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-6 px-8 pb-8">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              disabled={isLoading || formData.password !== formData.confirmPassword || formData.password.length < 6}
              data-testid="button-register"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Your Account"
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800/50 px-2 text-gray-400">Or</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 text-center">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors" 
                data-testid="link-login"
              >
                Sign in here
              </Link>
            </p>
          </CardFooter>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6">
        <p className="text-gray-400 text-sm">
          Join thousands protecting their privacy with blockchain technology
        </p>
      </div>
    </div>
  );
}