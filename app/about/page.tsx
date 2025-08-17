"use client"

import { motion } from "framer-motion"
import { Flower, Leaf, Users, Award, Target, Heart, Shield, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function About() {
  const values = [
    {
      icon: Leaf,
      title: "Environmental Stewardship",
      description: "Committed to protecting our planet through sustainable waste management."
    },
    {
      icon: Heart,
      title: "Community Impact",
      description: "Empowering communities to make a difference while earning recognition."
    },
    {
      icon: Shield,
      title: "Quality & Safety",
      description: "Ensuring the highest standards in collection and processing."
    },
    {
      icon: Globe,
      title: "Global Vision",
      description: "Working towards a sustainable future for generations to come."
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
              <Link href="/" className="text-gray-600 hover:text-orange-600 transition-colors">Home</Link>
              <Link href="/impact" className="text-gray-600 hover:text-orange-600 transition-colors">Impact</Link>
              <Link href="/felicitation" className="text-gray-600 hover:text-orange-600 transition-colors">Felicitation</Link>
              <Link href="/leaderboard" className="text-gray-600 hover:text-orange-600 transition-colors">Leaderboard</Link>
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
              About <span className="text-orange-500">PhoolSeFayda</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transforming religious waste into environmental wealth through community-driven initiatives
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To create a sustainable ecosystem where religious waste is transformed into valuable eco-friendly products, 
                while empowering communities to contribute to environmental conservation.
              </p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                To become the leading platform for religious waste management in India, creating a model that can be 
                replicated across the country to promote environmental sustainability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">The principles that guide our mission</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{value.description}</CardDescription>
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Mission</h2>
            <p className="text-xl text-white/90 mb-8">Be part of the solution and help us create a sustainable future</p>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
              <Link href="/request-pickup">Start Contributing</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
