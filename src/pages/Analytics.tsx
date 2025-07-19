import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, TrendingUp, Users, Star, DollarSign, Calendar, Download, Filter } from 'lucide-react'

export default function Analytics() {
  const navigate = useNavigate()

  const kpiData = [
    {
      title: 'Revenue Uplift',
      value: '₹1,24,500',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      description: 'Additional revenue from loyalty programs'
    },
    {
      title: 'Customer Retention',
      value: '78.5%',
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      description: 'Customers returning within 30 days'
    },
    {
      title: 'Avg. Visit Frequency',
      value: '2.3x',
      change: '+0.4x',
      trend: 'up',
      icon: Star,
      description: 'Average visits per customer per month'
    },
    {
      title: 'Program ROI',
      value: '340%',
      change: '+25%',
      trend: 'up',
      icon: TrendingUp,
      description: 'Return on investment for loyalty programs'
    }
  ]

  const programPerformance = [
    {
      name: 'Coffee Loyalty Card',
      customers: 1247,
      revenue: '₹89,500',
      redemptions: 156,
      growth: '+12%',
      status: 'active'
    },
    {
      name: 'VIP Membership',
      customers: 342,
      revenue: '₹67,800',
      redemptions: 89,
      growth: '+25%',
      status: 'active'
    },
    {
      name: 'Birthday Special',
      customers: 89,
      revenue: '₹12,300',
      redemptions: 67,
      growth: '+8%',
      status: 'active'
    },
    {
      name: 'Punch Card',
      customers: 567,
      revenue: '₹34,200',
      redemptions: 123,
      growth: '+15%',
      status: 'active'
    }
  ]

  const customerSegments = [
    { segment: 'New Customers', count: 456, percentage: 16, color: 'bg-blue-500' },
    { segment: 'Active Customers', count: 1567, percentage: 55, color: 'bg-green-500' },
    { segment: 'VIP Customers', count: 234, percentage: 8, color: 'bg-purple-500' },
    { segment: 'At-Risk Customers', count: 345, percentage: 12, color: 'bg-yellow-500' },
    { segment: 'Churned Customers', count: 245, percentage: 9, color: 'bg-red-500' }
  ]

  const recentInsights = [
    {
      title: 'Peak Visit Hours',
      insight: 'Most customers visit between 8-10 AM and 6-8 PM',
      action: 'Consider special offers during off-peak hours'
    },
    {
      title: 'Popular Rewards',
      insight: 'Free coffee is redeemed 3x more than discounts',
      action: 'Focus on experiential rewards over monetary discounts'
    },
    {
      title: 'Customer Lifecycle',
      insight: 'Average customer becomes VIP after 8 visits',
      action: 'Create milestone rewards at 5-7 visits to accelerate'
    },
    {
      title: 'Seasonal Trends',
      insight: 'Loyalty engagement increases 40% during festivals',
      action: 'Plan special campaigns around upcoming festivals'
    }
  ]

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
              <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Select defaultValue="30days">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {kpi.change} from last month
                </p>
                <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue from loyalty programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Revenue Growth Chart</p>
                      <p className="text-sm text-gray-500">Interactive chart showing monthly trends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition</CardTitle>
                  <CardDescription>New customers joining loyalty programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Customer Growth Chart</p>
                      <p className="text-sm text-gray-500">Track new customer acquisition</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments Distribution</CardTitle>
                <CardDescription>Breakdown of customers by engagement level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${segment.color}`} />
                        <span className="font-medium">{segment.segment}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{segment.count} customers</span>
                        <span className="text-sm font-medium">{segment.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Performance</CardTitle>
                <CardDescription>Compare performance across different loyalty programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programPerformance.map((program, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{program.name}</h3>
                        <p className="text-sm text-gray-500">{program.customers} customers enrolled</p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">{program.revenue}</div>
                          <div className="text-xs text-gray-500">Revenue</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{program.redemptions}</div>
                          <div className="text-xs text-gray-500">Redemptions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-green-600">{program.growth}</div>
                          <div className="text-xs text-gray-500">Growth</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">{program.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Lifetime Value</CardTitle>
                  <CardDescription>Average value per customer over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average CLV</span>
                      <span className="font-medium text-lg">₹4,567</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">VIP Customer CLV</span>
                      <span className="font-medium text-lg text-purple-600">₹12,890</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Regular Customer CLV</span>
                      <span className="font-medium text-lg">₹2,340</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Retention Metrics</CardTitle>
                  <CardDescription>Customer retention and churn analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">30-day Retention</span>
                      <span className="font-medium text-lg text-green-600">78.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">90-day Retention</span>
                      <span className="font-medium text-lg text-green-600">65.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Churn Rate</span>
                      <span className="font-medium text-lg text-red-600">8.7%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Actionable recommendations based on your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{insight.insight}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-blue-600 font-medium">💡 {insight.action}</p>
                        <Button size="sm" variant="outline">
                          Apply Suggestion
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