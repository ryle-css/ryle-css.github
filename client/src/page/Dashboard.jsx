import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  DollarSign, 
  CheckSquare, 
  Utensils, 
  TrendingUp,
  Bell
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { taskAPI, expenseAPI, habitAPI } from '../services/api'
import QuickStats from '../components/Dashboard/QuickStats'
import RecentActivity from '../components/Dashboard/RecentActivity'
import BudgetOverview from '../components/Dashboard/BudgetOverview'
import WeatherWidget from '../components/Dashboard/WeatherWidget'

const Dashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    todayTasks: [],
    recentExpenses: [],
    habitStreaks: [],
    quickStats: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, expensesRes, habitsRes] = await Promise.all([
        taskAPI.getTodayTasks(),
        expenseAPI.getRecentExpenses(5),
        habitAPI.getHabits()
      ])

      const quickStats = {
        pendingTasks: tasksRes.data.length,
        totalSpent: expensesRes.data.reduce((sum, exp) => sum + exp.amount, 0),
        activeHabits: habitsRes.data.length,
        completedToday: tasksRes.data.filter(t => t.completed).length
      }

      setDashboardData({
        todayTasks: tasksRes.data,
        recentExpenses: expensesRes.data,
        habitStreaks: habitsRes.data,
        quickStats
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { icon: CheckSquare, label: 'Add Task', path: '/tasks', color: 'bg-blue-500' },
    { icon: DollarSign, label: 'Log Expense', path: '/expenses', color: 'bg-green-500' },
    { icon: Utensils, label: 'Plan Meal', path: '/meals', color: 'bg-orange-500' },
    { icon: TrendingUp, label: 'Track Habit', path: '/habits', color: 'bg-purple-500' }
  ]

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good morning, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your daily overview for {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <WeatherWidget />
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <QuickStats stats={dashboardData.quickStats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className={`p-3 rounded-lg ${action.color} text-white mb-2 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Today's Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
              <Link 
                to="/tasks" 
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {dashboardData.todayTasks.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">
                      {new Date(task.dueDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  )}
                </div>
              ))}
              {dashboardData.todayTasks.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tasks for today</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <BudgetOverview />

          {/* Recent Activity */}
          <RecentActivity 
            expenses={dashboardData.recentExpenses}
            habits={dashboardData.habitStreaks}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
