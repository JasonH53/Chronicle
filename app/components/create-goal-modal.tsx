"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, Smartphone, Car, GraduationCap, Target } from "lucide-react"

interface CreateGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateGoal: (goalData: {
    name: string
    targetAmount: number
    targetDate: string
    initialInvestment: number
    portfolioType: string
    icon: string
  }) => void
  availableBalance: number
}

export function CreateGoalModal({ isOpen, onClose, onCreateGoal, availableBalance }: CreateGoalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    initialInvestment: "",
    portfolioType: "",
    icon: "target",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Goal name is required"
    }

    if (!formData.targetAmount || Number.parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0"
    }

    if (!formData.targetDate) {
      newErrors.targetDate = "Target date is required"
    } else if (new Date(formData.targetDate) <= new Date()) {
      newErrors.targetDate = "Target date must be in the future"
    }

    if (!formData.initialInvestment || Number.parseFloat(formData.initialInvestment) <= 0) {
      newErrors.initialInvestment = "Initial investment must be greater than 0"
    } else if (Number.parseFloat(formData.initialInvestment) > availableBalance) {
      newErrors.initialInvestment = "Initial investment cannot exceed available balance"
    }

    if (!formData.portfolioType) {
      newErrors.portfolioType = "Portfolio type is required"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onCreateGoal({
        name: formData.name,
        targetAmount: Number.parseFloat(formData.targetAmount),
        targetDate: formData.targetDate,
        initialInvestment: Number.parseFloat(formData.initialInvestment),
        portfolioType: formData.portfolioType,
        icon: formData.icon,
      })

      // Reset form
      setFormData({
        name: "",
        targetAmount: "",
        targetDate: "",
        initialInvestment: "",
        portfolioType: "",
        icon: "target",
      })
      setErrors({})
      onClose()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const goalIcons = [
    { value: "target", label: "General", icon: Target },
    { value: "plane", label: "Travel", icon: Plane },
    { value: "smartphone", label: "Tech", icon: Smartphone },
    { value: "car", label: "Vehicle", icon: Car },
    { value: "graduation", label: "Education", icon: GraduationCap },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Investment Goal</DialogTitle>
          <DialogDescription>Set up a new goal and start investing towards your dreams</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Trip to Europe, New MacBook"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="targetAmount"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={formData.targetAmount}
                onChange={(e) => handleInputChange("targetAmount", e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            {errors.targetAmount && <p className="text-sm text-destructive">{errors.targetAmount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => handleInputChange("targetDate", e.target.value)}
            />
            {errors.targetDate && <p className="text-sm text-destructive">{errors.targetDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialInvestment">Initial Investment</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="initialInvestment"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={formData.initialInvestment}
                onChange={(e) => handleInputChange("initialInvestment", e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground">Available balance: ${availableBalance.toLocaleString()}</p>
            {errors.initialInvestment && <p className="text-sm text-destructive">{errors.initialInvestment}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioType">Portfolio Type</Label>
            <Select value={formData.portfolioType} onValueChange={(value) => handleInputChange("portfolioType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your investment strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Very Conservative">Very Conservative</SelectItem>
                <SelectItem value="Conservative">Conservative</SelectItem>
                <SelectItem value="Balanced">Balanced</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Aggressive Growth">Aggressive Growth</SelectItem>
              </SelectContent>
            </Select>
            {errors.portfolioType && <p className="text-sm text-destructive">{errors.portfolioType}</p>}
          </div>

          <div className="space-y-2">
            <Label>Goal Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {goalIcons.map((iconOption) => {
                const IconComponent = iconOption.icon
                return (
                  <button
                    key={iconOption.value}
                    type="button"
                    onClick={() => handleInputChange("icon", iconOption.value)}
                    className={`p-3 rounded-lg border-2 transition-colors text-center ${
                      formData.icon === iconOption.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mx-auto" />
                    <p className="text-xs mt-1 text-center">{iconOption.label}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
