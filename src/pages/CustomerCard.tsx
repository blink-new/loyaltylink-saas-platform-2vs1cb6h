import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, QrCode, Star, Gift, Clock, MapPin, Phone, Mail, Sparkles, Zap } from 'lucide-react'

const CustomerCard = () => {
  const { merchantId } = useParams()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock customer data
  const customerData = {
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya@example.com',
    memberSince: '2024-01-15',
    tier: 'Gold',
    totalPoints: 450,
    totalVisits: 23,
    totalSpent: 12450
  }

  // Mock merchant data
  const merchantData = {
    name: 'Café Delight',
    address: '123 MG Road, Bangalore',
    phone: '+91 80 1234 5678',
    hours: '7:00 AM - 10:00 PM',
    logo: '☕'
  }

  // Mock loyalty program data
  const loyaltyProgram = {
    type: 'punch-card',
    name: 'Coffee Loyalty Card',
    description: 'Buy 10 coffees, get 1 free!',
    currentStamps: 7,
    requiredStamps: 10,
    nextReward: 'Free Coffee'
  }

  // Mock available rewards
  const availableRewards = [
    {
      id: 1,
      name: 'Free Coffee',
      description: 'Any regular coffee of your choice',
      pointsRequired: 100,
      available: true,
      icon: '☕'
    },
    {
      id: 2,
      name: '20% Off Next Visit',
      description: 'Discount on your entire order',
      pointsRequired: 150,
      available: true,
      icon: '🎫'
    },
    {
      id: 3,
      name: 'Free Pastry',
      description: 'Any pastry from our selection',
      pointsRequired: 80,
      available: true,
      icon: '🥐'
    },
    {
      id: 4,
      name: 'VIP Experience',
      description: 'Skip the queue + free upgrade',
      pointsRequired: 500,
      available: false,
      icon: '👑'
    }
  ]

  // Mock recent transactions
  const recentTransactions = [
    {
      id: 1,
      date: '2024-01-16',
      amount: 250,
      pointsEarned: 25,
      description: 'Cappuccino + Croissant'
    },
    {
      id: 2,
      date: '2024-01-14',
      amount: 180,
      pointsEarned: 18,
      description: 'Latte + Muffin'
    },
    {
      id: 3,
      date: '2024-01-12',
      amount: 320,
      pointsEarned: 32,
      description: 'Americano + Sandwich'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRedeemReward = (rewardId: number) => {
    const reward = availableRewards.find(r => r.id === rewardId)
    if (reward && reward.available && customerData.totalPoints >= reward.pointsRequired) {
      // Create a celebration effect
      const button = document.querySelector(`[data-reward-id="${rewardId}"]`)
      if (button) {
        button.classList.add('animate-pulse')
        setTimeout(() => button.classList.remove('animate-pulse'), 1000)
      }
      
      alert(`🎉 Congratulations! You've redeemed ${reward.name}! Show this to the cashier.`)
      
      // In a real app, this would update the backend
      console.log(`Redeemed reward: ${reward.name}`)
    } else {
      alert('Insufficient points or reward not available.')
    }
  }

  const progressPercentage = (loyaltyProgram.currentStamps / loyaltyProgram.requiredStamps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-3xl">{merchantData.logo}</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{merchantData.name}</h1>
              <p className="text-sm text-gray-600">Digital Loyalty Card</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {currentTime.toLocaleString()}
          </div>
        </div>

        {/* Customer Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">
                  {customerData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h2 className="font-bold text-lg">{customerData.name}</h2>
              <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                {customerData.tier} Member
              </Badge>
              <p className="text-sm text-gray-600">
                Member since {new Date(customerData.memberSince).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="card" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4">
            {/* QR Code */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-20 w-20 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Show this QR code to earn points
                </p>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  ID: {merchantId}
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  {loyaltyProgram.name}
                </CardTitle>
                <CardDescription>{loyaltyProgram.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{loyaltyProgram.currentStamps}/{loyaltyProgram.requiredStamps}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {[...Array(loyaltyProgram.requiredStamps)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          i < loyaltyProgram.currentStamps 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300'
                        }`}
                      >
                        {i < loyaltyProgram.currentStamps && <Star className="h-4 w-4 text-white" />}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm font-medium text-blue-900">
                      {loyaltyProgram.requiredStamps - loyaltyProgram.currentStamps} more stamps for {loyaltyProgram.nextReward}!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Points Balance */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {customerData.totalPoints}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Points Available</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{customerData.totalVisits}</div>
                      <div className="text-gray-500">Total Visits</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">₹{customerData.totalSpent.toLocaleString()}</div>
                      <div className="text-gray-500">Total Spent</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-purple-500" />
                  Available Rewards
                </CardTitle>
                <CardDescription>
                  Redeem your points for exciting rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableRewards.map((reward) => (
                    <div 
                      key={reward.id} 
                      className={`p-3 border rounded-lg ${
                        reward.available && customerData.totalPoints >= reward.pointsRequired
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{reward.icon}</div>
                          <div>
                            <div className="font-medium">{reward.name}</div>
                            <div className="text-sm text-gray-600">{reward.description}</div>
                            <div className="text-sm font-medium text-blue-600">
                              {reward.pointsRequired} points
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          disabled={!reward.available || customerData.totalPoints < reward.pointsRequired}
                          onClick={() => handleRedeemReward(reward.id)}
                          data-reward-id={reward.id}
                          className="transition-all duration-300 hover:scale-105"
                        >
                          {customerData.totalPoints >= reward.pointsRequired ? (
                            <span className="flex items-center">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Redeem
                            </span>
                          ) : (
                            'Need More'
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  Recent Visits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{transaction.amount}</div>
                        <div className="text-sm text-green-600">+{transaction.pointsEarned} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Merchant Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-500" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{merchantData.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{merchantData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{merchantData.hours}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Powered by LoyaltyLink</p>
          <p>Digital loyalty made simple</p>
        </div>
      </div>
    </div>
  )
}

export default CustomerCard