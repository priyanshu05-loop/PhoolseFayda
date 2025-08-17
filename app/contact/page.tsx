"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Flower, Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Thank you for your message! We'll get back to you soon.")
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "info@phoolsefayda.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 98765 43210",
      description: "Mon-Fri from 9am to 6pm"
    },
    {
      icon: MapPin,
      title: "Address",
      value: "Green Valley, Eco City, Mumbai",
      description: "Visit our office"
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "9:00 AM - 6:00 PM",
      description: "Monday to Friday"
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
              Get in <span className="text-orange-500">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Have questions about our services? Want to partner with us? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Information</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reach out to us through any of these channels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold text-gray-800 mb-2">{info.value}</div>
                    <CardDescription className="text-base">{info.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Send Us a Message</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </motion.div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select name="subject" value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="pickup">Pickup Request</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how we can help you..."
                    rows={5}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmitting ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How does the flower collection process work?",
                answer: "Simply place your used flower garlands in our designated bins and request a pickup through our platform. Our team will collect them and process them into eco-friendly products."
              },
              {
                question: "What types of flowers can be collected?",
                answer: "We accept all types of flower garlands, including marigolds, roses, jasmine, and other religious offerings. The flowers should be free from plastic or synthetic materials."
              },
              {
                question: "How do I earn reward points?",
                answer: "You earn points based on the quantity of flowers collected. Each kilogram of flowers typically earns you 10 points, which can be redeemed for various rewards and recognition."
              },
              {
                question: "Is there a minimum quantity requirement?",
                answer: "No minimum quantity is required. We collect flowers of any amount, from small offerings to large quantities from temples and societies."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join our community and start making a positive environmental impact today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
                <Link href="/request-pickup">Request Pickup</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
