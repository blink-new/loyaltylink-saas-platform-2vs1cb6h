import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, X, CheckCircle, AlertCircle, Info, TrendingUp } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'achievement'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionLabel?: string
  onAction?: () => void
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Milestone Reached! 🎉',
      message: 'Your Coffee Loyalty program has reached 1,000 customers!',
      timestamp: '2 hours ago',
      read: false,
      actionLabel: 'View Analytics',
      onAction: () => console.log('Navigate to analytics')
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Engagement Alert',
      message: '156 customers haven\'t visited in 30+ days. Consider sending a win-back campaign.',
      timestamp: '5 hours ago',
      read: false,
      actionLabel: 'Create Campaign',
      onAction: () => console.log('Navigate to campaigns')
    },
    {
      id: '3',
      type: 'info',
      title: 'New Feature Available',
      message: 'WhatsApp Business API integration is now live! Connect your account to send automated messages.',
      timestamp: '1 day ago',
      read: true,
      actionLabel: 'Setup WhatsApp',
      onAction: () => console.log('Setup WhatsApp')
    },
    {
      id: '4',
      type: 'success',
      title: 'Payment Received',
      message: 'Your monthly subscription payment of ₹2,999 has been processed successfully.',
      timestamp: '2 days ago',
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'achievement':
        return <TrendingUp className="h-5 w-5 text-purple-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'achievement':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          >
            Mark all read
          </Button>
        </div>
        <CardDescription>
          Stay updated with your business insights and important alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
              <p className="text-sm">We'll notify you about important updates</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg transition-colors ${
                  notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getBadgeColor(notification.type)}`}
                        >
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        {notification.actionLabel && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              notification.onAction?.()
                              markAsRead(notification.id)
                            }}
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissNotification(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default NotificationCenter