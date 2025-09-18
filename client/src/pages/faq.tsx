import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Shield, 
  DollarSign, 
  Lock,
  Users,
  Zap,
  ArrowLeft,
  Play
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: any;
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const setLocation = (path: string) => {
    // Navigation function placeholder
    console.log('Navigate to:', path);
  };

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Why use blockchain for data privacy?',
      answer: 'Blockchain provides immutable, transparent records of all data sharing agreements. This ensures that your consent is permanently recorded and cannot be altered without your knowledge. It also enables automated smart contracts that execute payments based on your data usage.',
      category: 'blockchain',
      icon: Shield
    },
    {
      id: '2',
      question: 'How do I earn money from my data?',
      answer: 'Companies pay you directly for access to your anonymized data. The more data you share and the more valuable it is, the more you earn. Payments are processed through smart contracts on the blockchain, ensuring you receive your earnings automatically.',
      category: 'earnings',
      icon: DollarSign
    },
    {
      id: '3',
      question: 'Is my personal data safe?',
      answer: 'Yes, we use advanced encryption and only share anonymized, aggregated data. Your personal identifiers are never shared with third parties. All data sharing is done through secure, encrypted channels with strict privacy controls.',
      category: 'privacy',
      icon: Lock
    },
    {
      id: '4',
      question: 'How much can I realistically earn?',
      answer: 'Earnings vary based on your data value and sharing preferences. Most users earn between ₹500-₹5,000 per month. High-value data like health information or detailed behavioral patterns can earn significantly more.',
      category: 'earnings',
      icon: DollarSign
    },
    {
      id: '5',
      question: 'Can I revoke my data sharing at any time?',
      answer: 'Absolutely! You have complete control over your data. You can revoke access to any company instantly through our dashboard. The blockchain will record this revocation and stop all future data sharing immediately.',
      category: 'privacy',
      icon: Lock
    },
    {
      id: '6',
      question: 'What types of data can I monetize?',
      answer: 'You can monetize various types of data including browsing habits, location data (anonymized), purchase history, app usage patterns, social media activity, and more. The more diverse your data, the more valuable it becomes.',
      category: 'data',
      icon: Users
    },
    {
      id: '7',
      question: 'How does the smart contract system work?',
      answer: 'Smart contracts automatically execute when companies access your data. They calculate payments based on data usage, process payments instantly, and maintain transparent records of all transactions on the blockchain.',
      category: 'blockchain',
      icon: Zap
    },
    {
      id: '8',
      question: 'What if a company misuses my data?',
      answer: 'All data sharing agreements are recorded on the blockchain with strict terms. If a company violates these terms, the smart contract can automatically revoke access and impose penalties. You also have legal recourse through our terms of service.',
      category: 'privacy',
      icon: Shield
    },
    {
      id: '9',
      question: 'How do I connect my MetaMask wallet?',
      answer: 'Simply click the "Connect Wallet" button in the dashboard. This will prompt MetaMask to connect to our platform. Your wallet address will be used to receive payments and sign blockchain transactions.',
      category: 'wallet',
      icon: Users
    },
    {
      id: '10',
      question: 'Are there any fees for using the platform?',
      answer: 'We charge a small 5% fee on your earnings to cover platform maintenance and blockchain transaction costs. The remaining 95% goes directly to you. There are no upfront costs or subscription fees.',
      category: 'earnings',
      icon: DollarSign
    },
    {
      id: '11',
      question: 'How often do I get paid?',
      answer: 'Payments are processed automatically through smart contracts. You can withdraw your earnings anytime through our dashboard. Most users choose to withdraw weekly or monthly, but you have complete control over when you get paid.',
      category: 'earnings',
      icon: DollarSign
    },
    {
      id: '12',
      question: 'Can I see which companies are using my data?',
      answer: 'Yes, our dashboard provides complete transparency. You can see exactly which companies have access to your data, what data they\'re using, how often they access it, and how much they\'ve paid you.',
      category: 'privacy',
      icon: Shield
    }
  ];

  const categories = [
    { key: 'all', label: 'All Questions', icon: HelpCircle },
    { key: 'blockchain', label: 'Blockchain', icon: Shield },
    { key: 'privacy', label: 'Privacy', icon: Lock },
    { key: 'earnings', label: 'Earnings', icon: DollarSign },
    { key: 'data', label: 'Data Types', icon: Users },
    { key: 'wallet', label: 'Wallet', icon: Users }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating data points */}
        <div className="absolute top-20 left-16 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-64 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-64 left-2/3 w-3 h-3 bg-blue-200 rounded-full animate-pulse opacity-30" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-2/3 right-12 w-2 h-2 bg-purple-200 rounded-full animate-bounce opacity-40" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute top-1/3 left-8 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-50" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-35" style={{animationDelay: '0.8s'}}></div>
        
        {/* Animated background blurs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-l from-purple-600/15 to-blue-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-tl from-purple-500/8 to-pink-500/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
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
              onClick={() => setLocation('/login')}
            >
              Login
            </Button>
            <Button 
              variant="outline"
              className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 transition-all duration-300 hover:border-blue-400 hover:shadow-blue-400/20 shadow-lg"
              onClick={() => setLocation('/dashboard')}
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
      
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 mr-4 hover:bg-blue-400/10"
                onClick={() => setLocation('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about MindShield, data privacy, and earning from your data
            </p>
          </div>

          {/* Category Filters */}
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 shadow-xl hover:border-blue-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.key;
                  return (
                    <Button
                      key={category.key}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 transform shadow-lg ${
                        isSelected 
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-blue-500/25" 
                          : "border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-blue-500/50 hover:text-blue-400 backdrop-blur-sm"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{category.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isOpen = openItems.has(item.id);
              
              return (
                <Card 
                  key={item.id} 
                  className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-blue-500/10 hover:scale-[1.01] transform group"
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <CardContent className="p-0">
                    <Button
                      variant="ghost"
                      className="w-full p-6 text-left justify-between hover:bg-gray-700/30 transition-all duration-300"
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 mt-1 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                          <Icon className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-2 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                            {item.question}
                          </h3>
                          {isOpen && (
                            <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                              <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="p-1 rounded-full bg-gray-700/50 group-hover:bg-blue-500/20 transition-all duration-300">
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                          )}
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm border-blue-500/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  Still have questions?
                </h2>
                <p className="text-gray-300 mb-6">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform">
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-blue-500/50 hover:text-blue-400 backdrop-blur-sm transition-all duration-300 hover:scale-105 transform"
                >
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}