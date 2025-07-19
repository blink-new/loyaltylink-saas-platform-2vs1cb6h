import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import { 
  Star, 
  ArrowLeft, 
  CreditCard, 
  Gift, 
  Trophy, 
  Users,
  Settings,
  Eye,
  Save,
  Smartphone,
  QrCode,
  Sparkles
} from 'lucide-react'

const ProgramBuilder = () => {
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [programData, setProgramData] = useState({
    name: '',
    description: '',
    type: '',
    earnRate: 1,
    rewardThreshold: 10,
    expiryDays: 365,
    isActive: true,
    minPurchaseAmount: 0,
    maxRewardsPerDay: null,
    doublePointsDays: '',
    welcomeMessage: true,
    rewardNotification: true,
    expiryReminders: true
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const templates = [
    {
      id: 'punch-card',
      name: 'Punch Card',
      description: 'Classic stamp-based loyalty program',
      icon: <CreditCard className="h-8 w-8" />,
      color: 'bg-blue-500',
      features: ['Simple stamp collection', 'Fixed reward threshold', 'Perfect for cafes & restaurants'],
      example: 'Buy 10 coffees, get 1 free'
    },
    {
      id: 'points',
      name: 'Points Program',
      description: 'Earn points for every purchase',
      icon: <Star className="h-8 w-8" />,
      color: 'bg-green-500',
      features: ['Flexible point earning', 'Multiple reward tiers', 'Great for retail stores'],
      example: 'Earn 1 point per ₹100 spent'
    },
    {
      id: 'lucky-draw',
      name: 'Lucky Draw',
      description: 'Gamified loyalty with prizes',
      icon: <Trophy className="h-8 w-8" />,
      color: 'bg-purple-500',
      features: ['Exciting prize draws', 'Increased engagement', 'Perfect for special events'],
      example: 'Every purchase = 1 draw entry'
    },
    {
      id: 'membership',
      name: 'Paid Membership',
      description: 'Premium subscription program',
      icon: <Users className="h-8 w-8" />,
      color: 'bg-amber-500',
      features: ['Recurring revenue', 'Exclusive benefits', 'Ideal for gyms & salons'],
      example: '₹999/month for VIP benefits'
    }
  ]

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setProgramData({
        ...programData,
        type: templateId,
        name: template.name + ' Program'
      })
    }
  }

  const handleSaveProgram = async () => {
    if (!user) {
      alert('Please log in to save your program')
      return
    }

    if (!programData.name.trim()) {
      alert('Please enter a program name')
      return
    }

    setLoading(true)
    try {
      // Save program to database
      const program = await blink.db.loyaltyPrograms.create({
        id: `prog_${Date.now()}`,
        userId: user.id,
        name: programData.name,
        description: programData.description,
        type: selectedTemplate,
        earnRate: programData.earnRate,
        rewardThreshold: programData.rewardThreshold,
        expiryDays: programData.expiryDays,
        isActive: programData.isActive,
        minPurchaseAmount: programData.minPurchaseAmount,
        maxRewardsPerDay: programData.maxRewardsPerDay,
        doublePointsDays: programData.doublePointsDays,
        welcomeMessage: programData.welcomeMessage,
        rewardNotification: programData.rewardNotification,
        expiryReminders: programData.expiryReminders,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      console.log('Program saved:', program)
      alert('🎉 Program saved successfully! Your loyalty program is now active.')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving program:', error)
      alert('Error saving program. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Program Builder</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm" onClick={handleSaveProgram}>
                <Save className="h-4 w-4 mr-2" />
                Save Program
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedTemplate ? (
          // Template Selection
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Loyalty Program Type
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Select a template that best fits your business model. You can customize it later.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-500"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white`}>
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Example:</p>
                        <p className="text-sm text-gray-600">{template.example}</p>
                      </div>
                      <ul className="space-y-2">
                        {template.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Program Configuration
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuration Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Program Details</CardTitle>
                  <CardDescription>
                    Configure your {templates.find(t => t.id === selectedTemplate)?.name} program
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Program Name</Label>
                    <Input
                      id="name"
                      value={programData.name}
                      onChange={(e) => setProgramData({...programData, name: e.target.value})}
                      placeholder="e.g., Coffee Loyalty Card"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={programData.description}
                      onChange={(e) => setProgramData({...programData, description: e.target.value})}
                      placeholder="Describe your loyalty program benefits..."
                      rows={3}
                    />
                  </div>

                  {selectedTemplate === 'punch-card' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="threshold">Stamps Required</Label>
                        <Input
                          id="threshold"
                          type="number"
                          value={programData.rewardThreshold}
                          onChange={(e) => setProgramData({...programData, rewardThreshold: parseInt(e.target.value)})}
                          min="1"
                          max="20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reward">Reward</Label>
                        <Input
                          id="reward"
                          placeholder="e.g., Free Coffee"
                        />
                      </div>
                    </div>
                  )}

                  {selectedTemplate === 'points' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="earnRate">Points per ₹100</Label>
                        <Input
                          id="earnRate"
                          type="number"
                          value={programData.earnRate}
                          onChange={(e) => setProgramData({...programData, earnRate: parseInt(e.target.value)})}
                          min="1"
                          max="10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="redeemRate">Points for Reward</Label>
                        <Input
                          id="redeemRate"
                          type="number"
                          placeholder="e.g., 100"
                        />
                      </div>
                    </div>
                  )}

                  {selectedTemplate === 'membership' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Monthly Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="e.g., 999"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billing">Billing Cycle</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cycle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Period (Days)</Label>
                    <Input
                      id="expiry"
                      type="number"
                      value={programData.expiryDays}
                      onChange={(e) => setProgramData({...programData, expiryDays: parseInt(e.target.value)})}
                      min="30"
                      max="365"
                    />
                    <p className="text-sm text-gray-500">
                      How long before unused rewards expire
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="active">Active Program</Label>
                      <p className="text-sm text-gray-500">
                        Customers can join and earn rewards
                      </p>
                    </div>
                    <Switch
                      id="active"
                      checked={programData.isActive}
                      onCheckedChange={(checked) => setProgramData({...programData, isActive: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Additional configuration options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="rules" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="rules">Rules</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                      <TabsTrigger value="integration">Integration</TabsTrigger>
                    </TabsList>

                    <TabsContent value="rules" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Minimum Purchase Amount</Label>
                            <p className="text-sm text-gray-500">Minimum spend to earn rewards</p>
                          </div>
                          <Input 
                            className="w-32" 
                            type="number"
                            value={programData.minPurchaseAmount}
                            onChange={(e) => setProgramData({...programData, minPurchaseAmount: parseInt(e.target.value) || 0})}
                            placeholder="₹0" 
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Maximum Rewards per Day</Label>
                            <p className="text-sm text-gray-500">Limit daily reward earning</p>
                          </div>
                          <Input 
                            className="w-32" 
                            type="number"
                            value={programData.maxRewardsPerDay || ''}
                            onChange={(e) => setProgramData({...programData, maxRewardsPerDay: e.target.value ? parseInt(e.target.value) : null})}
                            placeholder="Unlimited" 
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Double Points Days</Label>
                            <p className="text-sm text-gray-500">Special earning multiplier days</p>
                          </div>
                          <Select 
                            value={programData.doublePointsDays}
                            onValueChange={(value) => setProgramData({...programData, doublePointsDays: value})}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              <SelectItem value="weekends">Weekends</SelectItem>
                              <SelectItem value="birthdays">Birthdays</SelectItem>
                              <SelectItem value="holidays">Holidays</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Welcome Message</Label>
                            <p className="text-sm text-gray-500">Send when customer joins</p>
                          </div>
                          <Switch 
                            checked={programData.welcomeMessage}
                            onCheckedChange={(checked) => setProgramData({...programData, welcomeMessage: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Reward Earned Notification</Label>
                            <p className="text-sm text-gray-500">Notify when reward is available</p>
                          </div>
                          <Switch 
                            checked={programData.rewardNotification}
                            onCheckedChange={(checked) => setProgramData({...programData, rewardNotification: checked})}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Expiry Reminders</Label>
                            <p className="text-sm text-gray-500">Warn before rewards expire</p>
                          </div>
                          <Switch 
                            checked={programData.expiryReminders}
                            onCheckedChange={(checked) => setProgramData({...programData, expiryReminders: checked})}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="integration" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>POS Integration</Label>
                            <p className="text-sm text-gray-500">Connect with your point of sale</p>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>WhatsApp Business API</Label>
                            <p className="text-sm text-gray-500">Send messages via WhatsApp</p>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Payment Gateway</Label>
                            <p className="text-sm text-gray-500">For paid memberships</p>
                          </div>
                          <Button variant="outline" size="sm">Setup</Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5" />
                    <span>Mobile Preview</span>
                  </CardTitle>
                  <CardDescription>
                    How customers will see your program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-2xl p-4 mx-auto max-w-sm">
                    <div className="bg-white rounded-xl p-4 space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          {templates.find(t => t.id === selectedTemplate)?.icon}
                        </div>
                        <h3 className="font-bold text-lg">{programData.name || 'Program Name'}</h3>
                        <p className="text-sm text-gray-600">{programData.description || 'Program description will appear here'}</p>
                      </div>

                      {selectedTemplate === 'punch-card' && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-500">3/{programData.rewardThreshold}</span>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            {[...Array(programData.rewardThreshold)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                  i < 3 ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                                }`}
                              >
                                {i < 3 && <Star className="h-4 w-4 text-white" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedTemplate === 'points' && (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">450</div>
                          <div className="text-sm text-gray-600">Points Available</div>
                          <Button size="sm" className="mt-2">Redeem Reward</Button>
                        </div>
                      )}

                      <div className="flex items-center justify-center space-x-2 pt-4 border-t">
                        <QrCode className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Show QR to earn rewards</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Program Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <Badge variant="secondary">
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge variant={programData.isActive ? "default" : "secondary"}>
                      {programData.isActive ? "Active" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expiry:</span>
                    <span className="text-sm">{programData.expiryDays} days</span>
                  </div>
                  {selectedTemplate === 'punch-card' && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stamps needed:</span>
                      <span className="text-sm">{programData.rewardThreshold}</span>
                    </div>
                  )}
                  {selectedTemplate === 'points' && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Earn rate:</span>
                      <span className="text-sm">{programData.earnRate} pts/₹100</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <QRCodeGenerator 
                merchantId="demo-merchant"
                programId={selectedTemplate}
              />

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={handleSaveProgram}
                  disabled={loading || !user}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save & Activate Program'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setProgramData({...programData, isActive: false})
                    handleSaveProgram()
                  }}
                  disabled={loading || !user}
                >
                  Save as Draft
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setSelectedTemplate('')}
                  disabled={loading}
                >
                  Change Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgramBuilder