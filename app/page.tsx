"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Flower, Leaf, Award, Users, TrendingUp, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Navigation from "@/components/navigation"

const FloatingFlower = ({ delay = 0 }) => (
  <motion.div
    className="absolute"
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      delay,
    }}
  >
    <Flower className="w-8 h-8 text-orange-400 opacity-60" />
  </motion.div>
)

const CounterCard = ({ icon: Icon, title, count, suffix = "" }: { 
  icon: React.ComponentType<{ className?: string }>, 
  title: string, 
  count: number, 
  suffix?: string 
}) => {
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
      <Card className="text-center">
        <CardContent className="pt-6">
          <Icon className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-orange-600">
            {displayCount.toLocaleString()}
            {suffix}
          </div>
          <p className="text-sm text-gray-600">{title}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Floating Flowers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingFlower delay={0} />
        <div className="absolute top-20 right-10">
          <FloatingFlower delay={1} />
        </div>
        <div className="absolute top-40 left-20">
          <FloatingFlower delay={2} />
        </div>
        <div className="absolute bottom-40 right-20">
          <FloatingFlower delay={3} />
        </div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Transform Used <span className="text-orange-500">Flowers</span> into{" "}
              <span className="text-green-600">Eco-Products</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our community-driven initiative to collect used flower garlands from temples and societies,
              converting them into agarbattis, compost, and natural dyes while earning reward points.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/request-pickup">Request Pickup</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/track-pickup">Track Contribution</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/impact">See Impact</Link>
            </Button>
          </motion.div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <CounterCard icon={Leaf} title="Kg Flowers Collected" count={15420} suffix="+" />
            <CounterCard icon={Users} title="Societies Onboarded" count={156} suffix="+" />
            <CounterCard icon={Award} title="Garlands Recycled" count={8934} suffix="+" />
            <CounterCard icon={TrendingUp} title="Eco-Products Made" count={2341} suffix="+" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How PhoolSeFayda Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to make a meaningful environmental impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Collect & Request",
                description: "Fill our special bins with used flower garlands and request pickup through our platform",
                icon: MapPin,
              },
              {
                step: "2",
                title: "We Process",
                description: "Our partner recyclers convert flowers into agarbattis, compost, dyes, and eco-products",
                icon: Leaf,
              },
              {
                step: "3",
                title: "Earn & Get Recognized",
                description: "Earn reward points and get felicitated on national days for your contribution",
                icon: Award,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">
                      <span className="text-orange-500 font-bold">Step {item.step}:</span> {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of communities already contributing to a greener future
            </p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
              <Link href="/request-pickup">Start Your First Pickup</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Flower className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-bold">PhoolSeFayda</span>
              </div>
              <p className="text-gray-400">
                Transforming used flowers into eco-friendly products for a sustainable future.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/impact" className="hover:text-white transition-colors">
                    Impact
                  </Link>
                </li>
                <li>
                  <Link href="/felicitation" className="hover:text-white transition-colors">
                    Felicitation
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/request-pickup" className="hover:text-white transition-colors">
                    Request Pickup
                  </Link>
                </li>
                <li>
                  <Link href="/track-pickup" className="hover:text-white transition-colors">
                    Track Pickup
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-white transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="text-gray-400 space-y-2">
                <p>Email: info@phoolsefayda.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: Green Valley, Eco City</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PhoolSeFayda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
