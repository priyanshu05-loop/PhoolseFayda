"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Calendar, Clock, CheckCircle, Truck, Package, Flower } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

interface PickupData {
  id: string
  status: string
  address: string
  requestDate: string
  scheduledDate: string
  quantity: number
  pointsEarned: number
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    "in-transit": { color: "bg-purple-100 text-purple-800", icon: Truck },
    completed: { color: "bg-green-100 text-green-800", icon: Package },
    cancelled: { color: "bg-red-100 text-red-800", icon: "✕" }
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {typeof Icon === 'string' ? Icon : <Icon className="w-4 h-4 mr-1" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const PickupCard = ({ pickup }: { pickup: PickupData }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Pickup #{pickup.id}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-2">
              <MapPin className="w-4 h-4" />
              <span>{pickup.address}</span>
            </CardDescription>
          </div>
          <StatusBadge status={pickup.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Requested: {pickup.requestDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Scheduled: {pickup.scheduledDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Flower className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Quantity: {pickup.quantity} kg</span>
          </div>
        </div>
        
        {pickup.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Pickup completed successfully!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              You earned {pickup.pointsEarned} points for this contribution.
            </p>
          </div>
        )}
        
        {pickup.status === 'in-transit' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <Truck className="w-5 h-5" />
              <span className="font-medium">Pickup in progress</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Our team is on the way to collect your flowers.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

export default function TrackPickup() {
  const [searchId, setSearchId] = useState("")
  const [searchType, setSearchType] = useState("id")
  const [searchResults, setSearchResults] = useState<PickupData[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock data for demonstration
  const mockPickups: PickupData[] = [
    {
      id: "PK001",
      status: "completed",
      address: "Green Valley Society, Block A, Apartment 101",
      requestDate: "Dec 15, 2024",
      scheduledDate: "Dec 18, 2024",
      quantity: 5.2,
      pointsEarned: 52
    },
    {
      id: "PK002",
      status: "in-transit",
      address: "Sunrise Apartments, Tower 3, Flat 205",
      requestDate: "Dec 20, 2024",
      scheduledDate: "Dec 22, 2024",
      quantity: 3.8,
      pointsEarned: 0
    },
    {
      id: "PK003",
      status: "confirmed",
      address: "Eco Gardens, Phase 2, House 45",
      requestDate: "Dec 21, 2024",
      scheduledDate: "Dec 24, 2024",
      quantity: 7.1,
      pointsEarned: 0
    }
  ]

  const handleSearch = () => {
    if (!searchId.trim()) return
    
    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      if (searchType === "id") {
        const result = mockPickups.filter(pickup => 
          pickup.id.toLowerCase().includes(searchId.toLowerCase())
        )
        setSearchResults(result)
      } else {
        // Search by address
        const result = mockPickups.filter(pickup => 
          pickup.address.toLowerCase().includes(searchId.toLowerCase())
        )
        setSearchResults(result)
      }
      setIsSearching(false)
    }, 1000)
  }

  return (
    <ProtectedRoute>
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
                <Link href="/felicitation" className="text-gray-600 hover:text-orange-600 transition-colors">
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
                Track Your <span className="text-orange-500">Pickup</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Monitor the status of your flower collection requests and track your environmental impact
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Search Pickup Status</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Enter your pickup ID or address to track the status of your request
              </p>
            </motion.div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="search">Search by</Label>
                      <Input
                        id="search"
                        placeholder="Enter pickup ID or address..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="searchType">Search Type</Label>
                      <Select value={searchType} onValueChange={setSearchType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">Pickup ID</SelectItem>
                          <SelectItem value="address">Address</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSearch} 
                    disabled={!searchId.trim() || isSearching}
                    className="w-full md:w-auto"
                  >
                    {isSearching ? (
                      <>
                        <Search className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        {searchResults.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Search Results</h2>
                <p className="text-xl text-gray-600">
                  Found {searchResults.length} pickup request{searchResults.length !== 1 ? 's' : ''}
                </p>
              </motion.div>

              <div className="space-y-6">
                {searchResults.map((pickup, index) => (
                  <PickupCard key={pickup.id} pickup={pickup} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recent Pickups */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Recent Pickups</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your latest flower collection requests and their current status
              </p>
            </motion.div>

            <div className="space-y-6">
              {mockPickups.map((pickup, index) => (
                <PickupCard key={pickup.id} pickup={pickup} />
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need to Request a Pickup?</h2>
              <p className="text-xl text-white/90 mb-8">
                Start contributing to environmental sustainability by requesting a flower collection
              </p>
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
                <Link href="/request-pickup">Request Pickup</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  )
}
