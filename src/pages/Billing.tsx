import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, ArrowLeft, CheckCircle, Clock, Download, Star, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const Billing = () => {
  const [currentPlan, setCurrentPlan] = useState('growth')
  
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 1499,
      period: 'month',
      description: 'Perfect for single location businesses',
      features: [
        '1 location',
        '1,000 customer contacts',
        'Stamp card & points programs',
        'Basic analytics',
        'Email support'
      ],
      limits: {
        locations: 1,
        customers: 1000,
        campaigns: 5
      }
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 2999,
      period: 'month',
      description: 'Ideal for growing businesses',
      features: [
        '3 locations',
        '5,000 customer contacts',
        'All program types',
        'WhatsApp & SMS campaigns',
        'Advanced analytics',
        'Priority support'
      ],
      limits: {
        locations: 3,
        customers: 5000,
        campaigns: 25
      },
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 5999,
      period: 'month',
      description: 'For established business chains',
      features: [
        'Unlimited locations',
        'Unlimited contacts',
        'Paid membership programs',
        'API access',
        'Custom integrations',
        'Dedicated support'
      ],
      limits: {
        locations: 'Unlimited',
        customers: 'Unlimited',
        campaigns: 'Unlimited'
      }
    }
  ]

  const currentPlanData = plans.find(p => p.id === currentPlan)
  
  const usage = {
    locations: 2,
    customers: 1247,
    campaigns: 8
  }

  const invoices = [
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: 2999,
      status: 'paid',
      plan: 'Growth Plan',
      period: 'Jan 2024'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-01',
      amount: 2999,
      status: 'paid',
      plan: 'Growth Plan',
      period: 'Dec 2023'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-01',
      amount: 1499,
      status: 'paid',
      plan: 'Starter Plan',
      period: 'Nov 2023'
    }
  ]

  const handlePlanChange = (planId: string) => {
    const newPlan = plans.find(p => p.id === planId)
    if (newPlan) {
      const confirmMessage = planId === currentPlan 
        ? `You're already on the ${newPlan.name} plan.`
        : `Upgrade to ${newPlan.name} plan for ₹${newPlan.price}/${newPlan.period}?`
      
      if (planId !== currentPlan && confirm(confirmMessage)) {
        setCurrentPlan(planId)
        alert(`Successfully upgraded to ${newPlan.name} plan! 🎉\n\nYour new features are now active.`)
      }
    }
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    // Simulate invoice download
    alert(`📄 Downloading invoice ${invoiceId}...`)
    
    // In a real app, this would generate and download the actual invoice
    setTimeout(() => {
      alert(`Invoice ${invoiceId} downloaded successfully!`)
    }, 1000)
  }

  const getUsagePercentage = (used: number | string, limit: number | string) => {
    if (limit === 'Unlimited') return 0
    return Math.min((Number(used) / Number(limit)) * 100, 100)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="icon" asChild className="mr-4">
              <Link to="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Billing & Plans</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      Current Plan: {currentPlanData?.name}
                      {currentPlanData?.popular && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800">Popular</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      ₹{currentPlanData?.price?.toLocaleString()}/{currentPlanData?.period} • {currentPlanData?.description}
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Locations</span>
                      <span className="text-sm text-gray-600">
                        {usage.locations} / {currentPlanData?.limits.locations}
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(usage.locations, currentPlanData?.limits.locations || 0)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Customers</span>
                      <span className="text-sm text-gray-600">
                        {usage.customers.toLocaleString()} / {typeof currentPlanData?.limits.customers === 'number' ? currentPlanData.limits.customers.toLocaleString() : currentPlanData?.limits.customers}
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(usage.customers, currentPlanData?.limits.customers || 0)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Campaigns</span>
                      <span className="text-sm text-gray-600">
                        {usage.campaigns} / {currentPlanData?.limits.campaigns}
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(usage.campaigns, currentPlanData?.limits.campaigns || 0)} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Summary */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">₹{currentPlanData?.price?.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Current Plan</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">Feb 1, 2024</div>
                      <p className="text-sm text-gray-600">Next Billing</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">₹8,497</div>
                      <p className="text-sm text-gray-600">Total Paid</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-gray-600">Upgrade or downgrade your plan anytime</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.id === currentPlan ? 'border-blue-500 shadow-lg' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                      Most Popular
                    </Badge>
                  )}
                  {plan.id === currentPlan && (
                    <Badge className="absolute -top-3 right-4 bg-green-600">
                      Current Plan
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      variant={plan.id === currentPlan ? "secondary" : "default"}
                      onClick={() => handlePlanChange(plan.id)}
                      disabled={plan.id === currentPlan}
                    >
                      {plan.id === currentPlan ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Current Plan
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          {plan.price > (currentPlanData?.price || 0) ? 'Upgrade' : 'Downgrade'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>
                  Download and view your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-gray-600">
                            {invoice.plan} • {invoice.period}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(invoice.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">₹{invoice.amount.toLocaleString()}</div>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Billing