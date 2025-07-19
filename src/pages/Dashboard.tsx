import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NotificationCenter from '@/components/NotificationCenter'
import { 
  Users, 
  TrendingUp, 
  Star, 
  MessageSquare, 
  Plus,
  BarChart3,
  Calendar,
  CreditCard,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState(null)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activePrograms: 0,
    monthlyRevenue: 0,
    rewardRedemptions: 0
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      if (state.user && !state.isLoading) {
        // Check if merchant exists (onboarding completed)
        try {
          const merchants = await blink.db.merchants.list({
            where: { userId: state.user.id },
            limit: 1
          })
          
          if (merchants.length === 0) {
            // No merchant found, redirect to onboarding
            navigate('/onboarding')
            return
          }
          
          const merchantData = merchants[0]
          setMerchant(merchantData)
          
          // Load real stats
          await loadDashboardStats(merchantData.id)
        } catch (error) {
          console.error('Error checking merchant:', error)
          navigate('/onboarding')
        }
      }
    })
    return unsubscribe
  }, [navigate])

  const loadDashboardStats = async (merchantId: string) => {
    try {
      // Load customers count
      const customers = await blink.db.customers.list({
        where: { merchantId },
        limit: 1000
      })
      
      // Load programs count
      const programs = await blink.db.loyaltyPrograms.list({
        where: { merchantId, isActive: "1" },
        limit: 100
      })
      
      // Load transactions for revenue and redemptions
      const transactions = await blink.db.transactions.list({
        where: { merchantId },
        limit: 1000
      })
      
      const monthlyRevenue = transactions
        .filter(t => t.transactionType === 'purchase' && 
          new Date(t.transactionDate).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + Number(t.purchaseAmount || 0), 0)
      
      const monthlyRedemptions = transactions
        .filter(t => t.transactionType === 'redeem' && 
          new Date(t.transactionDate).getMonth() === new Date().getMonth())
        .length
      
      setStats({
        totalCustomers: customers.length,
        activePrograms: programs.length,
        monthlyRevenue: Math.round(monthlyRevenue),
        rewardRedemptions: monthlyRedemptions
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

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
              Sign in to access your merchant dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => blink.auth.login('/dashboard')}
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const recentPrograms = [
    {
      id: 1,
      name: "Coffee Loyalty Card",
      type: "Punch Card",
      customers: 342,
      redemptions: 89,
      status: "Active"
    },
    {
      id: 2,
      name: "VIP Membership",
      type: "Paid Membership",
      customers: 156,
      redemptions: 45,
      status: "Active"
    },
    {
      id: 3,
      name: "Birthday Special",
      type: "Points Program",
      customers: 749,
      redemptions: 22,
      status: "Active"
    }
  ]

  const recentCustomers = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 43210",
      visits: 12,
      lastVisit: "2 hours ago",
      points: 450
    },
    {
      id: 2,
      name: "Rahul Patel",
      email: "rahul@example.com",
      phone: "+91 87654 32109",
      visits: 8,
      lastVisit: "1 day ago",
      points: 320
    },
    {
      id: 3,
      name: "Anjali Singh",
      email: "anjali@example.com",
      phone: "+91 76543 21098",
      visits: 15,
      lastVisit: "3 hours ago",
      points: 680
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">LoyaltyLink</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6 ml-8">
                <Link to="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
                <Link to="/programs" className="text-gray-600 hover:text-gray-900">Programs</Link>
                <Link to="/customers" className="text-gray-600 hover:text-gray-900">Customers</Link>
                <Link to="/campaigns" className="text-gray-600 hover:text-gray-900">Campaigns</Link>
                <Link to="/analytics" className="text-gray-600 hover:text-gray-900">Analytics</Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => blink.auth.logout('/')}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {merchant?.businessName || user.email?.split('@')[0] || 'Merchant'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your loyalty programs today.
          </p>
          {merchant?.subscriptionStatus === 'trial' && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-amber-800 font-medium">Free Trial Active</span>
              </div>
              <p className="text-amber-700 text-sm mt-1">
                Your 14-day free trial ends on {new Date(merchant.subscriptionEndDate).toLocaleDateString()}. 
                <Link to="/billing" className="underline ml-1">Choose a plan</Link> to continue.
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePrograms}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">2 new</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+25%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Redemptions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rewardRedemptions}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-dashed border-2 border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Plus className="h-8 w-8 text-gray-400 mb-4" />
              <CardTitle className="text-lg mb-2">Create New Program</CardTitle>
              <CardDescription className="text-center">
                Set up a new loyalty program in minutes
              </CardDescription>
              <Button className="mt-4" asChild>
                <Link to="/programs">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-gray-300 hover:border-green-500 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-8 w-8 text-gray-400 mb-4" />
              <CardTitle className="text-lg mb-2">Send Campaign</CardTitle>
              <CardDescription className="text-center">
                Reach customers with WhatsApp or SMS
              </CardDescription>
              <Button className="mt-4" variant="outline" asChild>
                <Link to="/campaigns">Create Campaign</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-gray-300 hover:border-purple-500 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <BarChart3 className="h-8 w-8 text-gray-400 mb-4" />
              <CardTitle className="text-lg mb-2">View Analytics</CardTitle>
              <CardDescription className="text-center">
                Track performance and customer insights
              </CardDescription>
              <Button className="mt-4" variant="outline" asChild>
                <Link to="/analytics">View Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div className="mb-8">
          <NotificationCenter />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="programs">Recent Programs</TabsTrigger>
            <TabsTrigger value="customers">Recent Customers</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Loyalty Programs</CardTitle>
                    <CardDescription>
                      Manage your active loyalty programs
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link to="/programs">
                      <Plus className="h-4 w-4 mr-2" />
                      New Program
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPrograms.map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Star className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{program.name}</h3>
                          <p className="text-sm text-gray-500">{program.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{program.customers}</div>
                          <div className="text-xs text-gray-500">Customers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{program.redemptions}</div>
                          <div className="text-xs text-gray-500">Redemptions</div>
                        </div>
                        <Badge variant="secondary">{program.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Customers</CardTitle>
                    <CardDescription>
                      Latest customer activity and engagement
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{customer.name}</h3>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium">{customer.visits}</div>
                          <div className="text-xs text-gray-500">Visits</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{customer.points}</div>
                          <div className="text-xs text-gray-500">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{customer.lastVisit}</div>
                          <div className="text-xs text-gray-500">Last Visit</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions and events in your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Plus className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">New customer <strong>Priya Sharma</strong> joined Coffee Loyalty Card</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Reward redeemed by <strong>Rahul Patel</strong> - Free Coffee</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">WhatsApp campaign sent to 342 customers</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Dashboard