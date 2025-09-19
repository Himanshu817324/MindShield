import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Wallet, 
  Settings, 
  DollarSign, 
  ArrowRight, 
  CheckCircle,
  Star,
  Users,
  Lock,
  TrendingUp,
  Zap,
  Globe,
  Database,
  Play,
  Pause
} from 'lucide-react';

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const scrollToVideo = () => {
    const videoSection = document.getElementById('demo-video-section');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleVideo = () => {
    const video = document.getElementById('demo-video') as HTMLVideoElement;
    if (video) {
      if (isVideoPlaying) {
        video.pause();
        setIsVideoPlaying(false);
      } else {
        video.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const features = [
    {
      id: 'privacy',
      title: 'Privacy Dashboard',
      description: 'Real-time privacy score with data source breakdown',
      icon: Shield,
      gradient: 'from-blue-500 to-purple-600',
      href: '/privacy'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Wallet',
      description: 'Secure identity management on the blockchain',
      icon: Wallet,
      gradient: 'from-blue-600 to-purple-700',
      href: '/dashboard'
    },
    {
      id: 'control',
      title: 'Data Control Center',
      description: 'Granular control over your data permissions',
      icon: Settings,
      gradient: 'from-purple-500 to-blue-600',
      href: '/dashboard'
    },
    {
      id: 'monetization',
      title: 'Monetization Dashboard',
      description: 'Earn from your data with transparent payments',
      icon: DollarSign,
      gradient: 'from-purple-600 to-pink-600',
      href: '/earnings'
    }
  ];

  const stats = [
    { label: 'Users Protected', value: '10K+', icon: Users },
    { label: 'Data Points Secured', value: '1M+', icon: Lock },
    { label: 'Average Earnings', value: '₹2,500', icon: TrendingUp },
    { label: 'Privacy Score', value: '95%', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Multiple layers of floating data points */}
        <div className="absolute top-20 left-16 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-64 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-64 left-2/3 w-3 h-3 bg-blue-200 rounded-full animate-pulse opacity-30" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-2/3 right-12 w-2 h-2 bg-purple-200 rounded-full animate-bounce opacity-40" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute top-1/3 left-8 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-50" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-35" style={{animationDelay: '0.8s'}}></div>
        
        {/* Enhanced animated background blurs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-l from-purple-600/15 to-blue-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-purple-500/8 to-pink-500/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
              MindShield
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:bg-blue-400/10"
              onClick={() => setLocation('/faq')}
            >
              FAQ
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-purple-400 transition-colors duration-300 hover:bg-purple-400/10"
              onClick={() => setLocation('/login')}
            >
              Login
            </Button>
            <Button 
              variant="outline"
              className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 transition-all duration-300 hover:border-blue-400 hover:shadow-blue-400/20 shadow-lg"
              onClick={scrollToVideo}
            >
              <Play className="mr-2 h-4 w-4" />
              Try Demo
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
              onClick={() => setLocation('/register')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.3) contrast(1.2)' }}
            poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSIjMTExODI3Ii8+CjxjaXJjbGUgY3g9IjQ4MCIgY3k9IjI3MCIgcj0iMTAwIiBmaWxsPSIjM0I0RjZGIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSIxNDQwIiBjeT0iODEwIiByPSIxNTAiIGZpbGw9IiM3QzNBRkYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CjxjaXJjbGUgY3g9IjE2MDAiIGN5PSIzMDAiIHI9IjgwIiBmaWxsPSIjRkY2QkE1IiBmaWxsLW9wYWNpdHk9IjAuMjUiLz4KPC9zdmc+"
          >
            <source src="/MindShield_hero.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            <div className="w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
          </video>
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-blue-900/75 to-purple-900/85"></div>
          
          {/* Enhanced Animated Data Visualization Overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-70"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1000ms'}}></div>
            <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-40" style={{animationDelay: '500ms'}}></div>
            
            {/* Floating Data Points */}
            <div className="absolute top-20 left-20 w-1 h-1 bg-white/60 rounded-full animate-ping delay-2000"></div>
            <div className="absolute top-32 right-32 w-1 h-1 bg-blue-300/60 rounded-full animate-pulse delay-1500"></div>
            <div className="absolute bottom-32 left-32 w-1 h-1 bg-purple-300/60 rounded-full animate-bounce delay-3000"></div>
            <div className="absolute bottom-20 right-20 w-1 h-1 bg-pink-300/60 rounded-full animate-ping delay-2500"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center px-6">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
                Your Data.
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                Your Rules.
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
                Your Rewards.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
              Take control of your digital identity. Monetize your data while maintaining complete privacy. 
              Built on blockchain technology for transparency and security.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-full border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 backdrop-blur-sm hover:scale-105 transform"
              onClick={() => setLocation('/register')}
            >
              Start Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white text-lg px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm bg-white/10 hover:scale-105 transform"
              onClick={scrollToVideo}
            >
              <Play className="mr-2 w-5 h-5" />
              Try Demo
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center backdrop-blur-sm bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 transform group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/25 transition-shadow duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">{stat.value}</div>
                <div className="text-gray-200 drop-shadow-md">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to take control of your digital identity and monetize your data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className="group relative overflow-hidden bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:scale-105 transform shadow-xl hover:shadow-blue-500/10"
                onMouseEnter={() => setIsHovered(feature.id)}
                onMouseLeave={() => setIsHovered(null)}
                onClick={() => setLocation(feature.href)}
              >
                <CardContent className="p-8 text-center relative z-10">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">{feature.title}</h3>
                  <p className="text-gray-300 mb-6">{feature.description}</p>
                  <div className="flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
                
                {/* Enhanced Hover Effect */}
                {isHovered === feature.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Take control of your data in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group hover:scale-105 transform shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">1. Connect Your Data</h3>
                <p className="text-gray-300 mb-6">
                  Securely connect your social media, browsing, and app data through our encrypted platform.
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/30">
                    <span className="text-blue-400 font-bold">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105 transform shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">2. Set Your Rules</h3>
                <p className="text-gray-300 mb-6">
                  Choose which companies can access your data and set your privacy preferences.
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                    <span className="text-purple-400 font-bold">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 group hover:scale-105 transform shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent mb-4">3. Earn & Control</h3>
                <p className="text-gray-300 mb-6">
                  Get paid automatically when companies use your data, with full transparency.
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-pink-500/30">
                    <span className="text-pink-400 font-bold">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Technology Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on blockchain and cutting-edge privacy technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 transform shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Blockchain</h3>
                <p className="text-gray-400 text-sm">Immutable data records and smart contracts</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 transform shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">Encryption</h3>
                <p className="text-gray-400 text-sm">End-to-end encryption for maximum security</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 transform shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">AI Analytics</h3>
                <p className="text-gray-400 text-sm">Smart data analysis and value assessment</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 transform shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Decentralized</h3>
                <p className="text-gray-400 text-sm">No single point of failure or control</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
              Why Choose MindShield?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The future of data ownership is here
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 backdrop-blur-sm border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">Complete Data Ownership</h3>
                  <p className="text-gray-300">You own your data. You control who accesses it and when.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 backdrop-blur-sm border border-blue-500/30">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Transparent Earnings</h3>
                  <p className="text-gray-300">See exactly how much you earn and from which companies.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 backdrop-blur-sm border border-purple-500/30">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Privacy First</h3>
                  <p className="text-gray-300">Your personal information stays private and secure.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 backdrop-blur-sm border border-yellow-500/30">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">Instant Payments</h3>
                  <p className="text-gray-300">Get paid automatically through smart contracts.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 backdrop-blur-sm border border-red-500/30">
                  <CheckCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">Revoke Anytime</h3>
                  <p className="text-gray-300">Stop data sharing instantly with one click.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 backdrop-blur-sm border border-cyan-500/30">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">Blockchain Security</h3>
                  <p className="text-gray-300">Immutable records ensure your consent is permanent.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Demo Video Section */}
      <section id="demo-video-section" className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            See MindShield in Action
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Watch our demo to see how easy it is to take control of your data
          </p>
          
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 overflow-hidden group hover:border-blue-500/50 transition-all duration-300 shadow-2xl">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                {/* Main Demo Video */}
                <video
                  id="demo-video"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0iIzExMTgyNyIvPgo8Y2lyY2xlIGN4PSI0ODAiIGN5PSIyNzAiIHI9IjEwMCIgZmlsbD0iIzNCNkY2RiIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPGNpcmNsZSBjeD0iMTQ0MCIgY3k9IjgxMCIgcj0iMTUwIiBmaWxsPSIjN0MzQUZGIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8Y2lyY2xlIGN4PSIxNjAwIiBjeT0iMzAwIiByPSI4MCIgZmlsbD0iI0ZGNkJBNSIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+Cjwvc3ZnPg=="
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source src="/MindShield_demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Overlay - Only show when not playing */}
                {!isVideoPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-purple-900/80 flex items-center justify-center">
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-2xl hover:shadow-purple-500/25"
                        onClick={toggleVideo}
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">Watch Demo</h3>
                      <p className="text-gray-300 drop-shadow-md">Click to play a short overview of MindShield's Motive and Features</p>
                    </div>
                  </div>
                )}
                
                {/* Video Controls - Show when playing */}
                {isVideoPlaying && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={toggleVideo}
                        className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
                      >
                        <Pause className="w-6 h-6 text-white" />
                      </button>
                      <div className="text-white text-sm backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                        MindShield Demo
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={() => setLocation('/register')}
                      >
                        Get Started
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                        onClick={() => setLocation('/login')}
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied users who have taken control of their data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 transform shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Finally, a way to earn from my data while keeping it private. I've made ₹2,500 this month alone!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Alex Chen</p>
                    <p className="text-gray-400 text-sm">Data Scientist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 transform shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The transparency is amazing. I can see exactly which companies are using my data and how much they're paying."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Sarah Johnson</p>
                    <p className="text-gray-400 text-sm">Marketing Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 transform shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The blockchain integration gives me confidence that my data is truly secure and my consent is permanent."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Mike Rodriguez</p>
                    <p className="text-gray-400 text-sm">Software Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border-blue-500/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                Ready to Take Control?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of users who are already monetizing their data while maintaining complete privacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 transform"
                  onClick={() => setLocation('/register')}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-400/50 text-gray-300 hover:bg-gray-400/10 text-lg px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 transform"
                  onClick={() => setLocation('/login')}
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-400/50 text-blue-400 hover:bg-blue-400/10 text-lg px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 transform"
                  onClick={scrollToVideo}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Try Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative px-6 py-12 border-t border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                MindShield
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">Built by SixBits</p>
              <div className="flex items-center justify-center md:justify-end space-x-4">
                <button 
                  onClick={() => setLocation('/faq')}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  FAQ
                </button>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}