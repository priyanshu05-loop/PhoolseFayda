"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Award, TrendingUp, Users, Leaf, Crown, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Mock leaderboard data
const societyLeaderboard = [
  {
    rank: 1,
    name: "Sunrise Apartments",
    location: "Sector 15, Noida",
    points: 2450,
    flowersCollected: 125.5,
    pickupsCompleted: 18,
    joinedDate: "2023-08-15",
    badge: "gold",
    avatar: "/modern-apartment-building.png",
  },
  {
    rank: 2,
    name: "Ganesh Temple",
    location: "MG Road, Delhi",
    points: 2100,
    flowersCollected: 98.2,
    pickupsCompleted: 15,
    joinedDate: "2023-09-01",
    badge: "silver",
    avatar: "/hindu-temple.png",
  },
  {
    rank: 3,
    name: "Green Valley Society",
    location: "Gurgaon",
    points: 1875,
    flowersCollected: 87.3,
    pickupsCompleted: 14,
    joinedDate: "2023-07-20",
    badge: "bronze",
    avatar: "/residential-society.png",
  },
  {
    rank: 4,
    name: "Shiva Mandir",
    location: "Connaught Place, Delhi",
    points: 1650,
    flowersCollected: 76.8,
    pickupsCompleted: 12,
    joinedDate: "2023-10-05",
    badge: "participant",
    avatar: "/shiva-temple.png",
  },
  {
    rank: 5,
    name: "Lotus Apartments",
    location: "Bangalore",
    points: 1420,
    flowersCollected: 65.4,
    pickupsCompleted: 11,
    joinedDate: "2023-09-15",
    badge: "participant",
    avatar: "/modern-apartments.png",
  },
]

const individualLeaderboard = [
  {
    rank: 1,
    name: "Priya Sharma",
    society: "Ganesh Temple",
    points: 850,
    contributions: 12,
    avatar: "/indian-woman-smiling.png",
  },
  {
    rank: 2,
    name: "Rajesh Kumar",
    society: "Sunrise Apartments",
    points: 720,
    contributions: 10,
    avatar: "/indian-professional-man.png",
  },
  {
    rank: 3,
    name: "Amit Patel",
    society: "Green Valley Society",
    points: 680,
    contributions: 9,
    avatar: "/indian-businessman.png",
  },
  {
    rank: 4,
    name: "Sunita Devi",
    society: "Shiva Mandir",
    points: 590,
    contributions: 8,
    avatar: "/elderly-indian-woman.png",
  },
  {
    rank: 5,
    name: "Vikram Singh",
    society: "Lotus Apartments",
    points: 520,
    contributions: 7,
    avatar: "/young-indian-man.png",
  },
]

const RankBadge = ({ rank, badge }) => {
  const badgeConfig = {
    gold: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Crown },
    silver: { color: "bg-gray-100 text-gray-800 border-gray-300", icon: Medal },
    bronze: { color: "bg-orange-100 text-orange-800 border-orange-300", icon: Award },
    participant: { color: "bg-blue-100 text-blue-800 border-blue-300", icon: Star },
  }

  const config = badgeConfig[badge] || badgeConfig.participant
  const Icon = config.icon

  if (rank <= 3) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.color} border-2`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-bold text-lg">#{rank}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300">
        <span className="text-sm font-bold">#{rank}</span>
      </div>
    </div>
  )
}

const LeaderboardCard = ({ item, type = "society" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: item.rank * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className={`hover:shadow-lg transition-all duration-300 ${item.rank <= 3 ? "ring-2 ring-orange-200" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RankBadge rank={item.rank} badge={item.badge || "participant"} />
              <Avatar className="w-12 h-12">
                <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.name} />
                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600 text-sm">{type === "society" ? item.location : item.society}</p>
                {type === "society" && (
                  <p className="text-xs text-gray-500">Member since {new Date(item.joinedDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{item.points}</div>
              <div className="text-sm text-gray-600">points</div>
              {type === "society" ? (
                <div className="text-xs text-gray-500 mt-1">
                  {item.flowersCollected} kg • {item.pickupsCompleted} pickups
                </div>
              ) : (
                <div className="text-xs text-gray-500 mt-1">{item.contributions} contributions</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("societies")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-800">PhoolSeFayda</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/impact" className="text-gray-600 hover:text-orange-600 transition-colors">
                Impact
              </Link>
              <Link href="/felicitation" className="text-gray-600 hover:text-orange-600 transition-colors">
                Felicitation
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Community Leaderboard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrating our top contributors making the biggest environmental impact
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">156</div>
              <p className="text-sm text-gray-600">Active Communities</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Leaf className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">15,420 kg</div>
              <p className="text-sm text-gray-600">Flowers Collected</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <p className="text-sm text-gray-600">Participation Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leaderboard Tabs */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Top Performers</CardTitle>
            <CardDescription className="text-center">
              Rankings based on contribution points and environmental impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="societies" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Societies & Temples
                </TabsTrigger>
                <TabsTrigger value="individuals" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Individual Contributors
                </TabsTrigger>
              </TabsList>

              <TabsContent value="societies" className="space-y-4">
                <div className="space-y-4">
                  {societyLeaderboard.map((society) => (
                    <LeaderboardCard key={society.rank} item={society} type="society" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="individuals" className="space-y-4">
                <div className="space-y-4">
                  {individualLeaderboard.map((individual) => (
                    <LeaderboardCard key={individual.rank} item={individual} type="individual" />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">Achievement Levels</CardTitle>
              <CardDescription className="text-center">
                Unlock badges based on your contribution milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-yellow-300">
                    <Crown className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-yellow-700">Gold Champion</h3>
                  <p className="text-sm text-gray-600">2000+ points</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-gray-300">
                    <Medal className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Silver Star</h3>
                  <p className="text-sm text-gray-600">1000+ points</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-orange-300">
                    <Award className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-orange-700">Bronze Hero</h3>
                  <p className="text-sm text-gray-600">500+ points</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-blue-300">
                    <Star className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-700">Green Warrior</h3>
                  <p className="text-sm text-gray-600">100+ points</p>
                </div>
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
          <Card className="bg-gradient-to-r from-orange-500 to-green-600 text-white">
            <CardContent className="py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">Join the Competition!</h2>
              <p className="text-xl mb-6 opacity-90">Start contributing today and climb up the leaderboard</p>
              <Link
                href="/request-pickup"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Make Your First Contribution
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
