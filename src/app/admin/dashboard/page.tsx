'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  Car,
  Wrench,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  ArrowRight,
  Settings,
  BarChart3,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  Activity,
  Database,
  Server,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { QuickStatsWidget } from '@/components/admin/QuickStatsWidget'
import { RecentActivitiesWidget } from '@/components/admin/RecentActivitiesWidget'
import { SystemHealthWidget } from '@/components/admin/SystemHealthWidget'
import { SimpleBarChart } from '@/components/admin/SimpleBarChart'
import { QuickActionCard } from '@/components/admin/QuickActionCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dynamic imports for heavy components (lazy loading)
const AdvancedAnalytics = dynamic(
  () => import('@/components/admin/AdvancedAnalytics').then(mod => ({ default: mod.AdvancedAnalytics })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500" />
      </div>
    )
  }
)

const LineChart = dynamic(
  () => import('@/components/admin/LineChart').then(mod => ({ default: mod.LineChart })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500" />
      </div>
    )
  }
)

interface DashboardStats {
  totalCars: number
  totalParts: number
  totalInquiries: number
  activeCars: number
  activeParts: number
  pendingInquiries: number
  totalViews: number
  todayViews: number
}

interface RecentActivity {
  id: string
  type: 'car' | 'part' | 'inquiry'
  action: string
  title: string
  time: string
}

export default function AdminDashboard() {
  const { t } = useLanguage()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalParts: 0,
    totalInquiries: 0,
    activeCars: 0,
    activeParts: 0,
    pendingInquiries: 0,
    totalViews: 0,
    todayViews: 0,
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [carsRes, partsRes, inquiriesRes, analyticsRes] = await Promise.all([
          fetch('/api/cars?includeInactive=true'),
          fetch('/api/parts?includeInactive=true'),
          fetch('/api/inquiries'),
          fetch('/api/analytics').catch(() => null)
        ])

        if (carsRes.ok) {
          const cars = await carsRes.json()
          const activeCars = cars.filter((c: any) => c.isActive).length
          setStats(prev => ({ 
            ...prev, 
            totalCars: cars.length,
            activeCars 
          }))
          
          // Add recent cars to activities
          const recentCars = cars.slice(0, 3).map((car: any) => ({
            id: car.id,
            type: 'car' as const,
            action: car.isActive ? 'نشط' : 'غير نشط',
            title: `${car.model} ${car.year}`,
            time: new Date(car.createdAt).toLocaleDateString('ar')
          }))
          setRecentActivities(prev => [...prev, ...recentCars])
        }

        if (partsRes.ok) {
          const parts = await partsRes.json()
          const activeParts = parts.filter((p: any) => p.isActive).length
          setStats(prev => ({ 
            ...prev, 
            totalParts: parts.length,
            activeParts 
          }))
        }

        if (inquiriesRes.ok) {
          const inquiries = await inquiriesRes.json()
          setStats(prev => ({ 
            ...prev, 
            totalInquiries: inquiries.length,
            pendingInquiries: inquiries.length // All inquiries are pending by default
          }))
          
          // Add recent inquiries to activities
          const recentInquiries = inquiries.slice(0, 2).map((inq: any) => ({
            id: inq.id,
            type: 'inquiry' as const,
            action: 'استفسار جديد',
            title: inq.name,
            time: new Date(inq.createdAt).toLocaleDateString('ar')
          }))
          setRecentActivities(prev => [...prev, ...recentInquiries])
        }

        if (analyticsRes && analyticsRes.ok) {
          const analytics = await analyticsRes.json()
          setStats(prev => ({
            ...prev,
            totalViews: analytics.overview?.totalViews || 0,
            todayViews: analytics.overview?.viewsToday || 0
          }))
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const statCards = [
    {
      title: 'إجمالي السيارات',
      value: stats.totalCars,
      subValue: `${stats.activeCars} نشط`,
      icon: Car,
      color: 'from-gold-600 to-gold-400',
      bgColor: 'bg-gold-500/10',
      textColor: 'text-gold-400',
      href: '/admin/cars',
      trend: '+12%'
    },
    {
      title: 'قطع الغيار',
      subtitle: 'Spare Parts',
      value: stats.totalParts,
      subValue: `${stats.activeParts} متوفر`,
      icon: Wrench,
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
      href: '/admin/parts',
      trend: '+8%'
    },
    {
      title: 'المشاهدات اليوم',
      subtitle: 'Today Views',
      value: stats.todayViews,
      subValue: `${stats.totalViews} إجمالي`,
      icon: Eye,
      color: 'from-purple-600 to-purple-400',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      href: '/admin/analytics',
      trend: '+23%'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gold-500/20 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-600 to-gold-400 text-black font-bold text-lg shadow-lg shadow-gold-500/50">
                VP
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gold-400">لوحة التحكم المتقدمة</span>
                <span className="text-xs text-muted-foreground">Advanced Dashboard</span>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gold-500 hover:text-gold-600 hover:bg-gold-500/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur border border-gold-500/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-400">
              التحليلات
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <QuickStatsWidget
                title="إجمالي السيارات"
                value={stats.totalCars}
                previousValue={stats.totalCars - 5}
                icon={Car}
                color="from-gold-600 to-gold-400"
                bgColor="bg-gold-500/10"
                textColor="text-gold-400"
                trend={`${stats.activeCars} نشط`}
                onClick={() => router.push('/admin/cars')}
                loading={loading}
              />
              <QuickStatsWidget
                title="قطع الغيار"
                subtitle="Spare Parts"
                value={stats.totalParts}
                previousValue={stats.totalParts - 3}
                icon={Wrench}
                color="from-green-600 to-green-400"
                bgColor="bg-green-500/10"
                textColor="text-green-400"
                trend={`${stats.activeParts} متوفر`}
                onClick={() => router.push('/admin/parts')}
                loading={loading}
              />
              <QuickStatsWidget
                title="المشاهدات اليوم"
                subtitle="Today Views"
                value={stats.todayViews}
                previousValue={stats.todayViews - 50}
                icon={Eye}
                color="from-purple-600 to-purple-400"
                bgColor="bg-purple-500/10"
                textColor="text-purple-400"
                trend={`${stats.totalViews} إجمالي`}
                onClick={() => router.push('/admin/analytics')}
                loading={loading}
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Activities */}
              <div className="lg:col-span-2">
                <RecentActivitiesWidget
                  activities={recentActivities.map(a => ({
                    ...a,
                    status: a.action === 'نشط' ? 'active' as const : 
                            a.action === 'قيد الانتظار' ? 'pending' as const : 
                            'completed' as const
                  }))}
                  loading={loading}
                  onViewAll={() => router.push('/admin/cars')}
                />
              </div>

              {/* System Health */}
              <SystemHealthWidget
                metrics={[
                  {
                    label: 'السيارات النشطة',
                    labelEn: 'Active Cars',
                    value: stats.activeCars,
                    total: stats.totalCars,
                    color: stats.activeCars / stats.totalCars > 0.7 ? 'green' : 'yellow'
                  },
                  {
                    label: 'قطع الغيار المتوفرة',
                    labelEn: 'Available Parts',
                    value: stats.activeParts,
                    total: stats.totalParts,
                    color: stats.activeParts / stats.totalParts > 0.7 ? 'green' : 'yellow'
                  },
                  {
                    label: 'الاستفسارات المعالجة',
                    labelEn: 'Handled Inquiries',
                    value: stats.totalInquiries - stats.pendingInquiries,
                    total: stats.totalInquiries,
                    color: (stats.totalInquiries - stats.pendingInquiries) / stats.totalInquiries > 0.8 ? 'green' : 'yellow'
                  }
                ]}
                services={[
                  {
                    name: 'قاعدة البيانات',
                    nameEn: 'Database',
                    status: 'online',
                    icon: Database
                  },
                  {
                    name: 'API',
                    nameEn: 'API Server',
                    status: 'online',
                    icon: Server
                  },
                  {
                    name: 'التحليلات',
                    nameEn: 'Analytics',
                    status: 'warning',
                    icon: BarChart3
                  }
                ]}
                loading={loading}
              />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SimpleBarChart
                title="المشاهدات حسب الصفحة"
                subtitle="Views by Page"
                data={[
                  { label: 'الرئيسية', value: 1245 },
                  { label: 'السيارات', value: 856 },
                  { label: 'قطع الغيار', value: 643 },
                  { label: 'من نحن', value: 432 },
                  { label: 'دليل الشراء', value: 321 }
                ]}
                color="bg-gold-500"
                icon={Eye}
                loading={loading}
              />

              <LineChart
                title="المشاهدات اليومية"
                subtitle="Daily Views - Last 7 Days"
                data={[
                  { label: 'السبت', value: 245 },
                  { label: 'الأحد', value: 312 },
                  { label: 'الاثنين', value: 289 },
                  { label: 'الثلاثاء', value: 367 },
                  { label: 'الأربعاء', value: 423 },
                  { label: 'الخميس', value: 398 },
                  { label: 'الجمعة', value: 456 }
                ]}
                color="stroke-gold-500"
                icon={TrendingUp}
              />
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="mb-4 text-xl font-semibold text-gold-400 flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                إجراءات سريعة | Quick Actions
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <QuickActionCard
                  title="لوحة التحليلات"
                  subtitle="Analytics"
                  icon={BarChart3}
                  gradient="bg-gradient-to-br from-purple-600 to-purple-400"
                  onClick={() => router.push('/admin/analytics')}
                />
                <QuickActionCard
                  title="إضافة سيارة"
                  subtitle="Add Car"
                  icon={Car}
                  gradient="bg-gradient-to-br from-gold-600 to-gold-400"
                  onClick={() => router.push('/admin/cars/new')}
                />
                <QuickActionCard
                  title="إضافة قطعة"
                  subtitle="Add Part"
                  icon={Wrench}
                  gradient="bg-gradient-to-br from-green-600 to-green-400"
                  onClick={() => router.push('/admin/parts/new')}
                />
                <QuickActionCard
                  title="الإعدادات"
                  subtitle="Settings"
                  icon={Settings}
                  gradient="bg-gradient-to-br from-blue-600 to-blue-400"
                  onClick={() => router.push('/admin/settings')}
                />
                <QuickActionCard
                  title="عرض الموقع"
                  subtitle="View Site"
                  icon={Eye}
                  gradient="bg-gradient-to-br from-slate-600 to-slate-400"
                  onClick={() => router.push('/')}
                />
              </div>
            </motion.div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
