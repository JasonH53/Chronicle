import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Target, TrendingUp, Smartphone, GraduationCap, Car, Plane } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Willow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#goals" className="text-muted-foreground hover:text-foreground transition-colors">
              Goals
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            Build Your Future!
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 leading-tight">
            Build Your <span className="text-primary">Dreams</span>, Block by Block!
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
            Just like in Minecraft, build your financial future one block at a time! Set goals for that epic trip to Spain, 
            a new gaming setup, or your first car - and watch your investments grow like your favorite builds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/create-account">
              <Button size="lg" className="text-lg px-8 py-6 group">
                GET STARTED!
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">No fees to start • Craft your financial future</p>
          </div>
        </div>
      </section>

      {/* Goal Examples */}
      <section id="goals" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Building Projects 🏗️</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See what other players are building towards with their investments
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Europe Trip</CardTitle>
                <CardDescription>3 months • $4,500 goal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">$2,850 / $4,500</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "63%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">New MacBook</CardTitle>
                <CardDescription>6 months • $2,200 goal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">$1,650 / $2,200</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">First Car</CardTitle>
                <CardDescription>12 months • $8,000 goal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">$3,200 / $8,000</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Crafters Choose Willow 🎯</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make investing as fun and visual as your favorite block-building game!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Blueprint-Based Building 📐</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every investment is a block in your dream build! No confusing portfolios - just clear goals like 
                that epic Europe adventure or dream gaming setup.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Player-Friendly 🎮</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built for the next generation! Start small like placing your first block, learn as you build, 
                and set goals that actually matter to you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Resource Multiplying ⚡</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pick your strategy from cautious mining to bold exploration! Watch your resources multiply 
                and your builds come to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Get started in minutes and watch your goals come to life</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground border-4 border-primary-foreground/20 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Set Your Goal</h3>
              <p className="text-muted-foreground">Tell us what you're saving for and when you need it</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground border-4 border-primary-foreground/20 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose Your Strategy</h3>
              <p className="text-muted-foreground">Pick a portfolio that matches your timeline and risk comfort</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground border-4 border-primary-foreground/20 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Watch It Grow</h3>
              <p className="text-muted-foreground">Track your progress and celebrate milestones along the way</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6 text-balance">Ready to Start Investing in Your Dreams?</h2>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Join thousands of students who are already building their future, one goal at a time.
          </p>
          <Link href="/create-account">
            <Button size="lg" className="text-lg px-8 py-6 group">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Target className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Willow</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Built by crafters, for crafters</span>
              <span>•</span>
              <span>Start building today</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
