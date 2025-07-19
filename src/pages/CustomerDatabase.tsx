import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  ArrowLeft,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  ChevronDown
} from 'lucide-react'

const CustomerDatabase = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [user, setUser] = useState(null)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    avgCustomerValue: 0,
    vipCustomers: 0
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      if (state.user && !state.isLoading) {
        await loadCustomers(state.user.id)
      }
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const loadCustomers = async (userId: string) => {
    try {
      // Load customers for this merchant
      const customerData = await blink.db.customers.list({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        limit: 1000
      })

      setCustomers(customerData)

      // Calculate stats
      const totalCustomers = customerData.length
      const activeCustomers = customerData.filter(c => c.status === 'active').length
      const vipCustomers = customerData.filter(c => c.status === 'vip').length
      
      // Calculate average customer value from transactions
      const transactions = await blink.db.transactions.list({
        where: { userId },
        limit: 10000
      })
      
      const totalSpent = transactions
        .filter(t => t.transactionType === 'purchase')
        .reduce((sum, t) => sum + Number(t.purchaseAmount || 0), 0)
      
      const avgCustomerValue = totalCustomers > 0 ? Math.round(totalSpent / totalCustomers) : 0

      setStats({
        totalCustomers,
        activeCustomers,
        avgCustomerValue,
        vipCustomers
      })
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  // Mock customer data for demo (will be replaced by real data)
  const mockCustomers = [
    {
      id: 1,
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      email: 'priya.sharma@email.com',
      joinDate: '2024-01-15',
      totalSpent: '₹12,450',
      visits: 23,
      points: 247,
      status: 'active',
      lastVisit: '2 days ago',
      program: 'Coffee Loyalty'
    },
    {
      id: 2,
      name: 'Rahul Patel',
      phone: '+91 87654 32109',
      email: 'rahul.patel@email.com',
      joinDate: '2024-02-20',
      totalSpent: '₹8,900',
      visits: 15,
      points: 156,
      status: 'active',
      lastVisit: '1 week ago',
      program: 'VIP Membership'
    },
    {
      id: 3,
      name: 'Anjali Singh',
      phone: '+91 76543 21098',
      email: 'anjali.singh@email.com',
      joinDate: '2024-03-10',
      totalSpent: '₹5,670',
      visits: 12,
      points: 89,
      status: 'active',
      lastVisit: '3 days ago',
      program: 'Punch Card'
    },
    {
      id: 4,
      name: 'Vikram Kumar',
      phone: '+91 65432 10987',
      email: 'vikram.kumar@email.com',
      joinDate: '2023-12-05',
      totalSpent: '₹18,230',
      visits: 34,
      points: 423,
      status: 'vip',
      lastVisit: '1 day ago',
      program: 'Coffee Loyalty'
    },
    {
      id: 5,
      name: 'Meera Reddy',
      phone: '+91 54321 09876',
      email: 'meera.reddy@email.com',
      joinDate: '2024-01-28',
      totalSpent: '₹3,450',
      visits: 8,
      points: 67,
      status: 'inactive',
      lastVisit: '2 months ago',
      program: 'Punch Card'
    }
  ]

  // Use real customers if available, otherwise use mock data for demo
  const displayCustomers = customers.length > 0 ? customers : mockCustomers

  const filteredCustomers = displayCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const handleSelectCustomer = (customerId: string | number) => {
    const id = String(customerId)
    setSelectedCustomers(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map(c => String(c.id)))
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedCustomers.length === 0) {
      alert('Please select customers first')
      return
    }
    
    switch (action) {
      case 'whatsapp':
        alert(`Sending WhatsApp campaign to ${selectedCustomers.length} customers`)
        break
      case 'email':
        alert(`Sending email campaign to ${selectedCustomers.length} customers`)
        break
      case 'export':
        alert(`Exporting ${selectedCustomers.length} customers`)
        break
      default:
        break
    }
    
    setSelectedCustomers([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'vip':
        return <Badge className="bg-purple-100 text-purple-800">VIP</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
              <h1 className="text-xl font-semibold text-gray-900">Customer Database</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-sm text-green-600">+12.5% this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.activeCustomers.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-sm text-green-600">+8.2% this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">₹{stats.avgCustomerValue.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Avg. Customer Value</p>
              <p className="text-sm text-green-600">+5.1% this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.vipCustomers}</div>
              <p className="text-sm text-gray-600">VIP Customers</p>
              <p className="text-sm text-green-600">+15.3% this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>
                  Manage your customer database and loyalty program members
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter ({filterStatus})
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                      All Customers
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                      Active Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('vip')}>
                      VIP Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                      Inactive Only
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {selectedCustomers.length > 0 && (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-blue-900">
                  {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('whatsapp')}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('email')}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Points/Stamps</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Visits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedCustomers.includes(String(customer.id))}
                          onCheckedChange={() => handleSelectCustomer(customer.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">
                            Joined {new Date(customer.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {customer.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.program}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{customer.points}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-green-600">{customer.totalSpent}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{customer.visits}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(customer.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{customer.lastVisit}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bulk Actions</CardTitle>
              <CardDescription>Perform actions on multiple customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => handleBulkAction('whatsapp')}
                disabled={selectedCustomers.length === 0}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send WhatsApp Campaign ({selectedCustomers.length})
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => handleBulkAction('email')}
                disabled={selectedCustomers.length === 0}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email Campaign ({selectedCustomers.length})
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => handleBulkAction('export')}
                disabled={selectedCustomers.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Selected ({selectedCustomers.length})
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Insights</CardTitle>
              <CardDescription>Key metrics and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Visit Frequency</span>
                <span className="font-medium">2.3 times/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retention Rate</span>
                <span className="font-medium text-green-600">87.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Churn Risk</span>
                <span className="font-medium text-red-600">156 customers</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest customer interactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Priya Sharma</div>
                <div className="text-gray-600">Redeemed 10% discount • 2 min ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Rahul Patel</div>
                <div className="text-gray-600">Joined VIP program • 15 min ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Anjali Singh</div>
                <div className="text-gray-600">Earned 2 stamps • 1 hour ago</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CustomerDatabase