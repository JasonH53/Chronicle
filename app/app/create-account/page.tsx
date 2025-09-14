"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, ArrowLeft } from "lucide-react"

export default function CreateAccountPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    startingBalance: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Call the backend API to register the user
      const response = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cash: parseFloat(formData.startingBalance) || 10000
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Clear any existing demo data and store fresh user data
        localStorage.removeItem("goalifyGoals")
        localStorage.setItem("goalifyUser", JSON.stringify({
          ...formData,
          clientId: data.client.id,
          startingBalance: data.client.cash.toString()
        }))
        router.push("/dashboard")
      } else {
        console.error('Registration failed:', await response.text())
        alert('Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Error registering user:', error)
      alert('Error registering user. Please try again.')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GoalifyInvest</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Start your investing journey in just a few steps</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Tell us a bit about yourself to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Starting Cash Balance</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={formData.startingBalance}
                    onChange={(e) => handleInputChange("startingBalance", e.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">This is the amount you have available to invest</p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Account & Continue
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By creating an account, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  )
}
