"use client"

import { motion } from "framer-motion"
import { Award, Trophy, Star, Calendar, Users, Flower } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const FelicitationCard = ({ title, date, description, icon: Icon, participants }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Icon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{participants} participants</span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

export default function Felicitation() {
  const upcomingEvents = [
    {
      title: "Republic Day Felicitation",
      date: "January 26, 2025",
      description: "Annual felicitation ceremony for top contributors and societies with highest flower collection",
      icon: Trophy,
      participants: 150
    },
    {
      title: "Independence Day Recognition",
      date: "August 15, 2025",
      description: "Special recognition for environmental champions and sustainable practices",
      icon: Star,
      participants: 200
    },
    {
      title: "Gandhi Jayanti Awards",
      date: "October 2, 2025",
      description: "Honoring individuals and communities for their contribution to cleanliness and sustainability",
      icon: Flower,
      participants: 180
    }
  ]

  const pastEvents = [
    {
      title: "Republic Day 2024",
      date: "January 26, 2024",
      description: "Successfully felicitated 120 contributors and 25 societies",
      icon: Award,
      participants: 120
    },
    {
      title: "Independence Day 2024",
      date: "August 15, 2024",
      description: "Recognized 180 environmental champions",
      icon: Star,
      participants: 180
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Flower className="w-8 h-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-800">PhoolSeFayda</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-orange-600 transition-colors">
                Home
              </Link>
              <Link href="/impact" className="text-gray-600 hover:text-orange-600 transition-colors">
                Impact
              </Link>
              <Link href="/felicitation" className="text-orange-600 font-medium">
                Felicitation
              </Link>
              <Link href="/leaderboard" className="text-gray-600 hover:text-orange-600 transition-colors">
                Leaderboard
              </Link>
              <Button variant="outline" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              <span className="text-orange-500">Felicitation</span> & Recognition
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Celebrating our environmental champions and recognizing their contributions to creating a sustainable future
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Upcoming Felicitations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join us in celebrating environmental achievements and sustainable practices
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {upcomingEvents.map((event, index) => (
              <FelicitationCard key={index} {...event} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/request-pickup">Start Contributing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Past Felicitations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Celebrating the achievements of our environmental champions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {pastEvents.map((event, index) => (
              <FelicitationCard key={index} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Be Part of the Celebration</h2>
            <p className="text-xl text-white/90 mb-8">
              Start contributing today and get recognized for your environmental impact
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
                <Link href="/request-pickup">Request Pickup</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600" asChild>
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
