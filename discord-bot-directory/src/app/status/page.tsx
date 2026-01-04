'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Server, Database, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'down' | 'maintenance'
  description: string
  lastChecked: string
  uptime: number
  responseTime?: number
}

interface SystemMetrics {
  totalBots: number
  activeUsers: number
  apiCalls: number
  databaseConnections: number
  serverLoad: number
  memoryUsage: number
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalBots: 0,
    activeUsers: 0,
    apiCalls: 0,
    databaseConnections: 0,
    serverLoad: 0,
    memoryUsage: 0,
  })
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchStatusData()
    const interval = setInterval(fetchStatusData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchStatusData = async () => {
    try {
      const response = await fetch('/api/status')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
        setMetrics(data.metrics)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error fetching status data:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'maintenance':
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getOverallStatus = () => {
    if (services.some(s => s.status === 'down')) return 'down'
    if (services.some(s => s.status === 'degraded')) return 'degraded'
    if (services.some(s => s.status === 'maintenance')) return 'maintenance'
    return 'operational'
  }

  const overallStatus = getOverallStatus()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-gray-600 mb-4">
            Real-time status and performance metrics for the Discord Bot Directory
          </p>
          <div className="flex items-center justify-center space-x-2">
            {getStatusIcon(overallStatus)}
            <Badge className={getStatusColor(overallStatus)}>
              {overallStatus === 'operational' && 'All Systems Operational'}
              {overallStatus === 'degraded' && 'Some Systems Degraded'}
              {overallStatus === 'down' && 'System Outage'}
              {overallStatus === 'maintenance' && 'Under Maintenance'}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bots</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalBots.toLocaleString()}</p>
                </div>
                <Server className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">API Calls (24h)</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.apiCalls.toLocaleString()}</p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Database Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.databaseConnections}</p>
                </div>
                <Database className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Server Load</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.serverLoad}%</p>
                </div>
                <Server className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Memory Usage</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.memoryUsage}%</p>
                </div>
                <Activity className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(service.status)}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </Badge>
                    <div className="mt-1 text-sm text-gray-500">
                      {service.uptime.toFixed(2)}% uptime
                      {service.responseTime && (
                        <span className="ml-2">
                          {service.responseTime}ms response
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">All systems operational</p>
                      <p className="text-sm text-green-600">No incidents reported in the last 24 hours</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Response Time</span>
                  <span className="font-semibold">245ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Rate</span>
                  <span className="font-semibold text-green-600">0.02%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database Query Time</span>
                  <span className="font-semibold">12ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cache Hit Rate</span>
                  <span className="font-semibold text-green-600">94.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
