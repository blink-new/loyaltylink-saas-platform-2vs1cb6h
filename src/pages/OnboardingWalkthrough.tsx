import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Store, 
  Users, 
  MessageSquare,
  CreditCard,
  Sparkles,
  Target,
  Gift,
  Trophy
} from 'lucide-react'

const OnboardingWalkthrough = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    selectedPlan: 'growth'
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user?.email) {
        setBusinessData(prev => ({ ...prev, email: state.user.email }))
      }
    })
    return unsubscribe
  }, [])

  const businessTypes = [
    'Food & Beverage',
    'Beauty & Wellness',
    'Retail Store',
    'Auto Services',
    'Fitness & Gym',
    'Healthcare',
    'Education',
    'Other'
  ]

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 1499,
      description: 'Perfect for single location',
      features: ['1 location', '1,000 customers', 'Basic analytics']
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 2999,
      description: 'Ideal for growing businesses',
      features: ['3 locations', '5,000 customers', 'WhatsApp campaigns'],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 5999,
      description: 'For established chains',
      features: ['Unlimited locations', 'Unlimited customers', 'API access']
    }
  ]

  const steps = [
    {
      id: 1,
      title: 'Welcome to LoyaltyLink',
      description: 'Let\'s get your business set up in just a few minutes',
      icon: <Star className="h-8 w-8" />
    },
    {
      id: 2,
      title: 'Business Information',
      description: 'Tell us about your business',
      icon: <Store className="h-8 w-8" />
    },
    {
      id: 3,
      title: 'Choose Your Plan',
      description: 'Select the plan that fits your needs',
      icon: <CreditCard className="h-8 w-8" />
    },
    {
      id: 4,
      title: 'Setup Complete',
      description: 'You\'re ready to start building loyalty!',
      icon: <CheckCircle className="h-8 w-8" />
    }
  ]

  const handleNext = async () => {
    if (currentStep === 2) {
      // Validate business information
      if (!businessData.businessName || !businessData.businessType || !businessData.phone) {
        alert('Please fill in all required fields')
        return
      }
    }

    if (currentStep === 3) {
      // Save merchant data and create subscription
      setLoading(true)
      try {
        const merchantId = `merchant_${Date.now()}`
        
        // Create merchant record
        await blink.db.merchants.create({
          id: merchantId,
          userId: user.id,
          businessName: businessData.businessName,
          businessType: businessData.businessType,
          email: businessData.email,
          phone: businessData.phone,
          address: businessData.address,
          city: businessData.city,
          state: businessData.state,
          pincode: businessData.pincode,
          subscriptionPlan: businessData.selectedPlan,
          subscriptionStatus: 'trial', // 14-day free trial
          subscriptionStartDate: new Date().toISOString(),
          subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
        })

        // Create initial analytics event
        await blink.db.analyticsEvents.create({
          id: `event_${Date.now()}`,
          merchantId,
          userId: user.id,
          eventType: 'merchant_onboarded',
          eventData: JSON.stringify({
            plan: businessData.selectedPlan,
            businessType: businessData.businessType
          })
        })

        setLoading(false)
        setCurrentStep(4)
      } catch (error) {
        console.error('Error creating merchant:', error)
        alert('Error setting up your account. Please try again.')
        setLoading(false)
      }
      return
    }

    if (currentStep === 4) {
      navigate('/dashboard')
      return
    }

    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const progress = (currentStep / steps.length) * 100

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome to LoyaltyLink</CardTitle>
            <CardDescription>
              Please sign in to continue with setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => blink.auth.login('/onboarding')}
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LoyaltyLink</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </div>
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl mb-4">Welcome to LoyaltyLink! 🎉</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  You're about to transform how you connect with customers. Let's set up your digital loyalty program in just a few simple steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Increase Retention</h3>
                    <p className="text-sm text-gray-600">Turn one-time visitors into loyal customers</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Direct Communication</h3>
                    <p className="text-sm text-gray-600">Reach customers via WhatsApp & SMS</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Trophy className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Boost Revenue</h3>
                    <p className="text-sm text-gray-600">Increase repeat purchases by 25%+</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <h4 className="font-semibold text-blue-900 mb-2">🎁 Special Launch Offer</h4>
                  <p className="text-blue-700">14-day free trial + Setup assistance included</p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Tell Us About Your Business</CardTitle>
                <CardDescription>
                  This helps us customize LoyaltyLink for your specific needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={businessData.businessName}
                      onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})}
                      placeholder="e.g., Café Delight"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select 
                      value={businessData.businessType} 
                      onValueChange={(value) => setBusinessData({...businessData, businessType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessData.email}
                      onChange={(e) => setBusinessData({...businessData, email: e.target.value})}
                      placeholder="business@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    value={businessData.address}
                    onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                    placeholder="Street address"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={businessData.city}
                      onChange={(e) => setBusinessData({...businessData, city: e.target.value})}
                      placeholder="Mumbai"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={businessData.state}
                      onChange={(e) => setBusinessData({...businessData, state: e.target.value})}
                      placeholder="Maharashtra"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={businessData.pincode}
                      onChange={(e) => setBusinessData({...businessData, pincode: e.target.value})}
                      placeholder="400001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
                <CardDescription>
                  Start with a 14-day free trial. Change or cancel anytime.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {plans.map((plan) => (
                    <Card 
                      key={plan.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        businessData.selectedPlan === plan.id 
                          ? 'border-blue-500 shadow-lg bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBusinessData({...businessData, selectedPlan: plan.id})}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              businessData.selectedPlan === plan.id 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300'
                            }`}>
                              {businessData.selectedPlan === plan.id && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold">{plan.name}</h3>
                                {plan.popular && (
                                  <Badge className="bg-blue-600">Most Popular</Badge>
                                )}
                              </div>
                              <p className="text-gray-600">{plan.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">₹{plan.price.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">/month</div>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {plan.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">14-day free trial included</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    No payment required now. You can cancel anytime during the trial.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl mb-4">🎉 You're All Set!</CardTitle>
                <CardDescription className="text-lg">
                  Welcome to LoyaltyLink, {businessData.businessName}! Your account is ready.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                      <span>Create your first loyalty program</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                      <span>Add your first customers</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                      <span>Send your first campaign</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <Gift className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-amber-800">Free Setup Support</h4>
                    <p className="text-sm text-amber-700">Our team will help you get started</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-800">14-Day Free Trial</h4>
                    <p className="text-sm text-green-700">Full access to all features</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <Button 
              onClick={handleNext}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === 4 ? 'Go to Dashboard' : 'Continue'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingWalkthrough