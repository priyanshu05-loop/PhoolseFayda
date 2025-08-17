"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Leaf, Users, Recycle, TreePine, Droplets, Factory } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const CounterCard = ({ icon: Icon, title, count, suffix = "", description, color = "text-green-600" }) => {
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0
      const increment = count / 50
      const counter = setInterval(() => {
        start += increment
        if (start >= count) {
          setDisplayCount(count)
          clearInterval(counter)
        } else {
          setDisplayCount(Math.floor(start))
        }
      }, 30)
    }, 500)

    return () => clearTimeout(timer)
  }, [count])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="text-center h-full">
        <CardContent className="pt-6">
          <Icon className={`w-12 h-12 mx-auto mb-4 ${color}`} />
          <div className={`text-3xl font-bold ${color} mb-2`}>
            {displayCount.toLocaleString()}
            {suffix}
          </div>
          <CardTitle className="text-lg mb-2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const ImpactMetric = ({ label, value, maxValue, unit, color = "bg-green-500" }) => {
  const percentage = (value / maxValue) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-gray-600">
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="text-xs text-gray-500 text-right">
        Target: {maxValue.toLocaleString()} {unit}
      </div>
    </div>
  )
}

export default function ImpactTracker() {
  const impactData = {
    flowersCollected: 15420,
    societiesOnboarded: 156,
    garlandsRecycled: 8934,
    ecoProductsMade: 2341,
    co2Saved: 1250,
    waterSaved: 45600,
    agarbattisProduced: 12500,
    compostMade: 3200,
  }

  const monthlyTargets = {
    flowersCollected: { current: 1200, target: 2000 },
    societiesOnboarded: { current: 12, target: 20 },
    garlandsRecycled: { current: 850, target: 1200 },
    ecoProductsMade: { current: 180, target: 300 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-800">PhoolSeFayda</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/leaderboard" className="text-gray-600 hover:text-green-600 transition-colors">
                Leaderboard
              </Link>
              <Link href="/felicitation" className="text-gray-600 hover:text-green-600 transition-colors">
                Felicitation
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Environmental Impact</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track the positive change we're making together through flower waste recycling and community participation
          </p>
        </motion.div>

        {/* Main Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <CounterCard
            icon={Leaf}
            title="Flowers Collected"
            count={impactData.flowersCollected}
            suffix=" kg"
            description="Total weight of flower waste collected from communities"
            color="text-green-600"
          />
          <CounterCard
            icon={Users}
            title="Communities Joined"
            count={impactData.societiesOnboarded}
            suffix="+"
            description="Societies and temples actively participating"
            color="text-blue-600"
          />
          <CounterCard
            icon={Recycle}
            title="Garlands Recycled"
            count={impactData.garlandsRecycled}
            suffix="+"
            description="Individual garlands processed into eco-products"
            color="text-purple-600"
          />
          <CounterCard
            icon={Factory}
            title="Eco-Products Made"
            count={impactData.ecoProductsMade}
            suffix="+"
            description="Agarbattis, compost, and dyes produced"
            color="text-orange-600"
          />
        </div>

        {/* Environmental Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center mb-2">Environmental Benefits</CardTitle>
              <CardDescription className="text-center">
                Positive impact on our planet through sustainable practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TreePine className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {impactData.co2Saved.toLocaleString()} kg
                  </div>
                  <h3 className="font-semibold mb-2">CO₂ Emissions Saved</h3>
                  <p className="text-sm text-gray-600">
                    Equivalent to planting 52 trees or removing 3 cars from roads for a month
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Droplets className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {impactData.waterSaved.toLocaleString()} L
                  </div>
                  <h3 className="font-semibold mb-2">Water Conserved</h3>
                  <p className="text-sm text-gray-600">
                    Through efficient processing and reduced need for fresh flower cultivation
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Recycle className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">98%</div>
                  <h3 className="font-semibold mb-2">Waste Diverted</h3>
                  <p className="text-sm text-gray-600">
                    From landfills and water bodies, preventing pollution and contamination
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Created */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center mb-2">Products Created</CardTitle>
              <CardDescription className="text-center">
                Sustainable products made from recycled flower waste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {impactData.agarbattisProduced.toLocaleString()}
                  </div>
                  <h3 className="font-semibold mb-2">Agarbattis Produced</h3>
                  <p className="text-sm text-gray-600">Natural incense sticks made from dried flower petals</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {impactData.compostMade.toLocaleString()} kg
                  </div>
                  <h3 className="font-semibold mb-2">Organic Compost</h3>
                  <p className="text-sm text-gray-600">Nutrient-rich fertilizer for sustainable agriculture</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">450 L</div>
                  <h3 className="font-semibold mb-2">Natural Dyes</h3>
                  <p className="text-sm text-gray-600">Eco-friendly colors for textile and craft industries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center mb-2">This Month's Progress</CardTitle>
              <CardDescription className="text-center">
                Track our progress towards monthly sustainability goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImpactMetric
                  label="Flowers Collected"
                  value={monthlyTargets.flowersCollected.current}
                  maxValue={monthlyTargets.flowersCollected.target}
                  unit="kg"
                />
                <ImpactMetric
                  label="New Communities"
                  value={monthlyTargets.societiesOnboarded.current}
                  maxValue={monthlyTargets.societiesOnboarded.target}
                  unit="societies"
                />
                <ImpactMetric
                  label="Garlands Processed"
                  value={monthlyTargets.garlandsRecycled.current}
                  maxValue={monthlyTargets.garlandsRecycled.target}
                  unit="pieces"
                />
                <ImpactMetric
                  label="Products Manufactured"
                  value={monthlyTargets.ecoProductsMade.current}
                  maxValue={monthlyTargets.ecoProductsMade.target}
                  unit="items"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Card className="bg-gradient-to-r from-green-500 to-orange-500 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-xl mb-6 opacity-90">Be part of the change and help us reach our next milestone</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/request-pickup"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Request Pickup
                </Link>
                <Link
                  href="/leaderboard"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                >
                  View Leaderboard
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
