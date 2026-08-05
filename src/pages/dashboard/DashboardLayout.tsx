import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../../components/sidebar/Sidebar'
import DashboardNavbar from '../../components/navbar/DashboardNavbar'
import { useDashboardData } from '../../hooks/useDashboardData'
import { generateInsights } from '../../utils/insights'
import { DashboardDataContext } from '../../contexts/DashboardDataContext'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dashboardData = useDashboardData()

  const insights = generateInsights(dashboardData.transactions, dashboardData.subscriptions)

  return (
    <DashboardDataContext.Provider value={dashboardData}>
      <div className="min-h-screen bg-canvas font-body flex">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <DashboardNavbar
            profile={dashboardData.profile}
            onOpenMobileSidebar={() => setMobileOpen(true)}
            unreadInsightsCount={insights.length}
          />

          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex-1 px-4 sm:px-6 py-6 max-w-[1600px] w-full mx-auto"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </DashboardDataContext.Provider>
  )
}
