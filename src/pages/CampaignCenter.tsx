import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Plus, MessageSquare, Mail, Send, Calendar, Users, TrendingUp, Eye } from 'lucide-react'

export default function CampaignCenter() {
  const navigate = useNavigate()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: '',
    message: '',
    segment: '',
    scheduledDate: ''
  })

  const campaigns = [
    {
      id: 1,
      name: 'Birthday Special Offers',
      type: 'WhatsApp',
      status: 'active',
      sent: 156,
      opened: 89,
      clicked: 23,
      lastSent: '2 hours ago',
      message: 'Happy Birthday! 🎉 Enjoy 20% off on your next visit. Valid till tomorrow!',
      segment: 'Birthday customers'
    },
    {
      id: 2,
      name: 'Weekend Coffee Deals',
      type: 'SMS',
      status: 'scheduled',
      sent: 0,
      opened: 0,
      clicked: 0,
      lastSent: 'Scheduled for tomorrow',
      message: 'Weekend Special: Buy 2 coffees, get 1 FREE! This weekend only.',
      segment: 'Active customers'
    },
    {
      id: 3,
      name: 'VIP Member Newsletter',
      type: 'Email',
      status: 'draft',
      sent: 0,
      opened: 0,
      clicked: 0,
      lastSent: 'Never',
      message: 'Exclusive VIP benefits and upcoming events just for you!',
      segment: 'VIP members'
    },
    {
      id: 4,
      name: 'Loyalty Points Reminder',
      type: 'WhatsApp',
      status: 'completed',
      sent: 342,
      opened: 198,
      clicked: 67,
      lastSent: '3 days ago',
      message: 'You have 450 points! Redeem them for exciting rewards.',
      segment: 'High points customers'
    }
  ]

  const templates = [
    {
      name: 'Birthday Offer',
      description: 'Special discount for customer birthdays',
      channel: 'WhatsApp',
      message: 'Happy Birthday! 🎉 Enjoy {discount}% off on your next visit. Valid till {expiry}!'
    },
    {
      name: 'Welcome Message',
      description: 'Greet new loyalty program members',
      channel: 'SMS',
      message: 'Welcome to our loyalty program! Start earning points with every purchase.'
    },
    {
      name: 'Reward Reminder',
      description: 'Remind customers about available rewards',
      channel: 'Email',
      message: 'You have {points} points waiting! Visit us to redeem exciting rewards.'
    },
    {
      name: 'Weekend Special',
      description: 'Weekend promotional offers',
      channel: 'WhatsApp',
      message: 'Weekend Special: {offer}! This weekend only. Don\'t miss out!'
    }
  ]

  const segments = [
    { value: 'all', label: 'All Customers', count: 2847 },
    { value: 'active', label: 'Active Customers', count: 2156 },
    { value: 'vip', label: 'VIP Members', count: 156 },
    { value: 'inactive', label: 'Inactive Customers', count: 691 },
    { value: 'birthday', label: 'Birthday This Month', count: 89 },
    { value: 'high-points', label: 'High Points (>500)', count: 234 }
  ]

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.type || !newCampaign.message) {
      alert('Please fill in all required fields')
      return
    }
    
    alert(`Campaign "${newCampaign.name}" created successfully!`)
    setIsCreateDialogOpen(false)
    setNewCampaign({
      name: '',
      type: '',
      message: '',
      segment: '',
      scheduledDate: ''
    })
  }

  const handleSendCampaign = (campaignId: number) => {
    const campaign = campaigns.find(c => c.id === campaignId)
    if (campaign) {
      alert(`Sending "${campaign.name}" campaign now...`)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      case 'completed':
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'WhatsApp':
        return <MessageSquare className="h-5 w-5 text-green-600" />
      case 'SMS':
        return <Send className="h-5 w-5 text-blue-600" />
      case 'Email':
        return <Mail className="h-5 w-5 text-purple-600" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Campaign Center</h1>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Set up a new marketing campaign to engage your customers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Campaign Name</Label>
                      <Input
                        id="name"
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        placeholder="e.g., Summer Sale Campaign"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Channel</Label>
                      <Select value={newCampaign.type} onValueChange={(value) => setNewCampaign({...newCampaign, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="segment">Target Audience</Label>
                    <Select value={newCampaign.segment} onValueChange={(value) => setNewCampaign({...newCampaign, segment: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {segments.map((segment) => (
                          <SelectItem key={segment.value} value={segment.value}>
                            {segment.label} ({segment.count} customers)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={newCampaign.message}
                      onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
                      placeholder="Write your campaign message..."
                      rows={4}
                    />
                    <p className="text-sm text-gray-500">
                      Use variables like {'{name}'}, {'{points}'}, {'{discount}'} for personalization
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduled">Schedule (Optional)</Label>
                    <Input
                      id="scheduled"
                      type="datetime-local"
                      value={newCampaign.scheduledDate}
                      onChange={(e) => setNewCampaign({...newCampaign, scheduledDate: e.target.value})}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCampaign}>
                      Create Campaign
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <p className="text-sm text-gray-600">Total Campaigns</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">8,456</div>
                  <p className="text-sm text-gray-600">Messages Sent</p>
                </div>
                <Send className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">67.8%</div>
                  <p className="text-sm text-gray-600">Open Rate</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">23.4%</div>
                  <p className="text-sm text-gray-600">Click Rate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Campaign List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>
                  Track performance of your marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getChannelIcon(campaign.type)}
                        </div>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.type} • {campaign.lastSent}</div>
                          <div className="text-sm text-gray-600 mt-1 max-w-md truncate">
                            {campaign.message}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{campaign.sent}</div>
                          <div className="text-xs text-gray-500">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{campaign.opened}</div>
                          <div className="text-xs text-gray-500">Opened</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{campaign.clicked}</div>
                          <div className="text-xs text-gray-500">Clicked</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(campaign.status)}
                          {campaign.status === 'draft' && (
                            <Button size="sm" onClick={() => handleSendCampaign(campaign.id)}>
                              Send Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Templates and Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>
                  Pre-built templates for quick campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{template.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {template.channel}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">{template.description}</div>
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded italic">
                        "{template.message}"
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>
                  Available audience segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {segments.slice(0, 5).map((segment) => (
                    <div key={segment.value} className="flex justify-between items-center">
                      <span className="text-sm">{segment.label}</span>
                      <Badge variant="secondary">{segment.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}