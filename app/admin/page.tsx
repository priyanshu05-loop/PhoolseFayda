"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Clock, Package, Award, Download, Eye, Filter, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/protected-route"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Mock data
const mockPickups = [
  {
    id: "PU001",
    locationName: "Sunrise Apartments",
    locationType: "society",
    contactName: "Rajesh Kumar",
    contactPhone: "+91 98765 43210",
    estimatedWeight: 5.2,
    preferredDate: "2024-01-15",
    status: "requested",
    imageUrl: "/placeholder-9un1h.png",
    notes: "Bin is located near the main gate",
    createdAt: "2024-01-10T10:30:00Z",
    adminNotes: "",
  },
  {
    id: "PU002",
    locationName: "Ganesh Temple",
    locationType: "temple",
    contactName: "Priya Sharma",
    contactPhone: "+91 87654 32109",
    estimatedWeight: 8.7,
    preferredDate: "2024-01-16",
    status: "scheduled",
    imageUrl: "/placeholder-6juh9.png",
    notes: "Large quantity after festival",
    createdAt: "2024-01-11T14:20:00Z",
    adminNotes: "Scheduled for morning pickup",
  },
  {
    id: "PU003",
    locationName: "Green Valley Society",
    locationType: "society",
    contactName: "Amit Patel",
    contactPhone: "+91 76543 21098",
    estimatedWeight: 3.1,
    preferredDate: "2024-01-14",
    status: "collected",
    imageUrl: "/placeholder-olfwx.png",
    notes: "Regular weekly pickup",
    createdAt: "2024-01-09T09:15:00Z",
    adminNotes: "Collected successfully, good quality flowers",
  },
]

const mockFelicitations = [
  {
    id: "F001",
    societyName: "Sunrise Apartments",
    address: "Sector 15, Noida",
    awardDate: "2024-01-26",
    category: "Independence Day 2024",
    points: 1250,
    status: "awarded",
  },
  {
    id: "F002",
    societyName: "Ganesh Temple",
    address: "MG Road, Delhi",
    awardDate: "2024-01-26",
    category: "Republic Day 2024",
    points: 2100,
    status: "pending",
  },
]

const StatusBadge = ({ status }) => {
  const statusConfig = {
    requested: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    scheduled: { color: "bg-blue-100 text-blue-800", icon: Clock },
    collected: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    processed: { color: "bg-purple-100 text-purple-800", icon: Package },
    rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
  }

  const config = statusConfig[status] || statusConfig.requested
  const Icon = config.icon

  return (
    <Badge className={`${config.color} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

const PickupCard = ({ pickup, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [adminNotes, setAdminNotes] = useState(pickup.adminNotes || "")

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onStatusUpdate(pickup.id, newStatus, adminNotes)
      toast({
        title: "Status Updated",
        description: `Pickup ${pickup.id} status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{pickup.locationName}</CardTitle>
            <CardDescription>
              ID: {pickup.id} • {pickup.locationType} • {pickup.estimatedWeight} kg
            </CardDescription>
          </div>
          <StatusBadge status={pickup.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Contact:</span> {pickup.contactName}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {pickup.contactPhone}
          </div>
          <div>
            <span className="font-medium">Preferred Date:</span> {new Date(pickup.preferredDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Created:</span> {new Date(pickup.createdAt).toLocaleDateString()}
          </div>
        </div>

        {pickup.notes && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-sm">Notes:</span>
            <p className="text-sm text-gray-600 mt-1">{pickup.notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pickup Image - {pickup.id}</DialogTitle>
              </DialogHeader>
              <img
                src={pickup.imageUrl || "/placeholder.svg"}
                alt="Pickup location"
                className="w-full h-64 object-cover rounded-lg"
              />
            </DialogContent>
          </Dialog>

          {pickup.status === "requested" && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate("scheduled")}
                disabled={isUpdating}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleStatusUpdate("rejected")}
                disabled={isUpdating}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}

          {pickup.status === "scheduled" && (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleStatusUpdate("collected")}
              disabled={isUpdating}
            >
              Mark Collected
            </Button>
          )}

          {pickup.status === "collected" && (
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => handleStatusUpdate("processed")}
              disabled={isUpdating}
            >
              Mark Processed
            </Button>
          )}
        </div>

        {(pickup.status === "requested" || pickup.adminNotes) && (
          <div className="space-y-2">
            <Label htmlFor={`notes-${pickup.id}`} className="text-sm font-medium">
              Admin Notes
            </Label>
            <Textarea
              id={`notes-${pickup.id}`}
              placeholder="Add notes about this pickup..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const { user } = useUser()
  const router = useRouter()
  const [pickups, setPickups] = useState(mockPickups)
  const [felicitations, setFelicitations] = useState(mockFelicitations)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Check if user has admin role (you can customize this logic)
  useEffect(() => {
    if (user && !user.publicMetadata?.role?.includes('admin')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [user, router])

  const handleStatusUpdate = (pickupId, newStatus, notes) => {
    setPickups((prev) =>
      prev.map((pickup) => (pickup.id === pickupId ? { ...pickup, status: newStatus, adminNotes: notes } : pickup)),
    )
  }

  const filteredPickups = pickups.filter((pickup) => {
    const matchesStatus = filterStatus === "all" || pickup.status === filterStatus
    const matchesSearch =
      pickup.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: pickups.length,
    requested: pickups.filter((p) => p.status === "requested").length,
    scheduled: pickups.filter((p) => p.status === "scheduled").length,
    collected: pickups.filter((p) => p.status === "collected").length,
    processed: pickups.filter((p) => p.status === "processed").length,
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage pickup requests and felicitations</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Felicitation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="pickups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pickups">Pickup Requests</TabsTrigger>
            <TabsTrigger value="felicitations">Felicitations</TabsTrigger>
          </TabsList>

          <TabsContent value="pickups" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.requested}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
                  <div className="text-sm text-gray-600">Scheduled</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.collected}</div>
                  <div className="text-sm text-gray-600">Collected</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.processed}</div>
                  <div className="text-sm text-gray-600">Processed</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by location, contact, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="collected">Collected</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pickup Cards */}
            <div className="grid gap-6">
              {filteredPickups.map((pickup) => (
                <PickupCard key={pickup.id} pickup={pickup} onStatusUpdate={handleStatusUpdate} />
              ))}
            </div>

            {filteredPickups.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pickup requests found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="felicitations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Felicitation Management
                </CardTitle>
                <CardDescription>Manage awards and recognition for contributing societies and temples</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {felicitations.map((felicitation) => (
                    <div key={felicitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{felicitation.societyName}</h3>
                        <p className="text-sm text-gray-600">{felicitation.address}</p>
                        <p className="text-sm text-gray-600">
                          {felicitation.category} • {felicitation.points} points
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={felicitation.status === "awarded" ? "default" : "secondary"}>
                          {felicitation.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Certificate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  )
}
