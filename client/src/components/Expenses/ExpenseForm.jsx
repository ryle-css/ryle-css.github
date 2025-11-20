import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, DollarSign, Tag, Calendar, MapPin } from 'lucide-react'
import { expenseAPI } from '../../services/api'

const ExpenseForm = ({ isOpen, onClose, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'card',
    location: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [aiCategorizing, setAiCategorizing] = useState(false)

  const categories = [
    { value: 'food', label: '🍔 Food & Dining', color: 'text-orange-600' },
    { value: 'transport', label: '🚗 Transport', color: 'text-blue-600' },
    { value: 'utilities', label: '💡 Utilities', color: 'text-yellow-600' },
    { value: 'housing', label: '🏠 Housing', color: 'text-green-600' },
    { value: 'entertainment', label: '🎬 Entertainment', color: 'text-purple-600' },
    { value: 'healthcare', label: '🏥 Healthcare', color: 'text-red-600' },
    { value: 'shopping', label: '🛍️ Shopping', color: 'text-pink-600' },
    { value: 'other', label: '📦 Other', color: 'text-gray-600' }
  ]

  const autoCategorize = async (description) => {
    if (!description) return
    
    setAiCategorizing(true)
    try {
      // Simple AI categorization logic - can be enhanced with actual ML API
      const desc = description.toLowerCase()
      let detectedCategory = 'other'
      
      if (desc.includes('food') || desc.includes('restaurant') || desc.includes('grocery') || desc.includes('coffee')) {
        detectedCategory = 'food'
      } else if (desc.includes('gas') || desc.includes('uber') || desc.includes('taxi') || desc.includes('bus')) {
        detectedCategory = 'transport'
      } else if (desc.includes('electric') || desc.includes('water') || desc.includes('internet') || desc.includes('phone')) {
        detectedCategory = 'utilities'
      } else if (desc.includes('rent') || desc.includes('mortgage')) {
        detectedCategory = 'housing'
      } else if (desc.includes('movie') || desc.includes('netflix') || desc.includes('game')) {
        detectedCategory = 'entertainment'
      } else if (desc.includes('doctor') || desc.includes('pharmacy') || desc.includes('medical')) {
        detectedCategory = 'healthcare'
      } else if (desc.includes('mall') || desc.includes('store') || desc.includes('amazon')) {
        detectedCategory = 'shopping'
      }
      
      setFormData(prev => ({ ...prev, category: detectedCategory }))
    } catch (error) {
      console.error('AI categorization failed:', error)
    } finally {
      setAiCategorizing(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.description) return

    setLoading(true)
    try {
      await expenseAPI.createExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      })
      onExpenseAdded()
      onClose()
      setFormData({
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'card',
        location: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error creating expense:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }))
    if (value.length > 3) {
      autoCategorize(value)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What was this expense for?"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category {aiCategorizing && <span className="text-xs text-indigo-600">(AI categorizing...)</span>}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                      className={`p-3 text-left rounded-lg border-2 transition-all ${
                        formData.category === cat.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`text-sm font-medium ${cat.color}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="card">💳 Credit Card</option>
                    <option value="cash">💵 Cash</option>
                    <option value="digital">📱 Digital</option>
                    <option value="other">⚡ Other</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Where did you spend this?"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Any additional notes..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.amount || !formData.description}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Adding Expense...' : 'Add Expense'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExpenseForm
