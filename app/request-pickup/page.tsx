"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, MapPin, Calendar, Weight, Phone, MessageSquare, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

interface FormData {
  locationType: string
  binId: string
  locationName: string
  estimatedWeight: string
  preferredDate: string
  preferredTime: string
  contactName: string
  contactPhone: string
  notes: string
  image: File | null
}

export default function RequestPickup() {
  const [formData, setFormData] = useState<FormData>({
    locationType: "",
    binId: "",
    locationName: "",
    estimatedWeight: "",
    preferredDate: "",
    preferredTime: "anytime",
    contactName: "",
    contactPhone: "",
    notes: "",
    image: null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.locationType || !formData.locationName || !formData.estimatedWeight || 
          !formData.preferredDate || !formData.contactName || !formData.contactPhone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Validate phone number format (10 digits)
      if (!/^[0-9]{10}$/.test(formData.contactPhone.replace(/\s/g, ''))) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit phone number.",
          variant: "destructive",
        });
        return;
      }

      // Validate weight
      if (parseFloat(formData.estimatedWeight) < 0.1) {
        toast({
          title: "Invalid Weight",
          description: "Estimated weight must be at least 0.1 kg.",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for API
      const pickupData = {
        locationType: formData.locationType,
        locationName: formData.locationName,
        estimatedWeight: parseFloat(formData.estimatedWeight),
        preferredDate: new Date(formData.preferredDate).toISOString(),
        preferredTime: formData.preferredTime || 'anytime',
        contactName: formData.contactName,
        contactPhone: formData.contactPhone.replace(/\s/g, ''),
        notes: formData.notes || '',
        binId: formData.binId || undefined
      };

      console.log('Submitting pickup data:', pickupData);
      
      // Send to backend API
      const response = await fetch('http://localhost:4000/api/pickups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pickupData),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (response.ok) {
        toast({
          title: "Pickup Request Submitted!",
          description: `Your request has been submitted successfully. Pickup ID: ${result.data.pickup.pickupId}`,
        });

        // Reset form
        setFormData({
          locationType: "",
          binId: "",
          locationName: "",
          estimatedWeight: "",
          preferredDate: "",
          preferredTime: "anytime",
          contactName: "",
          contactPhone: "",
          notes: "",
          image: null,
        });
        setImagePreview(null);
        
        // Show success message and redirect after a delay
        setTimeout(() => {
          window.location.href = `/track-pickup?pickupId=${result.data.pickup.pickupId}`;
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to submit request');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit pickup request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
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
              <Button variant="outline" asChild>
                <Link href="/track-pickup">Track Pickup</Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Request Flower Pickup</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Fill out the form below to schedule a pickup of your used flower garlands
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Pickup Request Details
                </CardTitle>
                <CardDescription>Please provide accurate information to help us serve you better</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Location Type */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Location Type *</Label>
                    <RadioGroup
                      value={formData.locationType}
                      onValueChange={(value) => handleInputChange("locationType", value)}
                      className="flex flex-wrap gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="residential" id="residential" />
                        <Label htmlFor="residential">Residential</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="commercial" id="commercial" />
                        <Label htmlFor="commercial">Commercial</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="temple" id="temple" />
                        <Label htmlFor="temple">Temple</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="event" id="event" />
                        <Label htmlFor="event">Event</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Location Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="binId">Bin ID (if available)</Label>
                      <Input
                        id="binId"
                        placeholder="e.g., BIN001"
                        value={formData.binId}
                        onChange={(e) => handleInputChange("binId", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locationName">Location Name *</Label>
                      <Input
                        id="locationName"
                        placeholder="e.g., Sunrise Apartments, Ganesh Temple"
                        value={formData.locationName}
                        onChange={(e) => handleInputChange("locationName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Upload Image of Bin/Garlands (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="max-w-full h-48 object-cover mx-auto rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setImagePreview(null)
                              setFormData((prev) => ({ ...prev, image: null }))
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <Label htmlFor="image-upload" className="cursor-pointer">
                              <span className="text-orange-600 hover:text-orange-700 font-medium">Click to upload</span>
                              <span className="text-gray-500"> or drag and drop</span>
                            </Label>
                            <Input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </div>
                          <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weight and Schedule */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="flex items-center gap-2">
                        <Weight className="w-4 h-4" />
                        Estimated Weight (kg) *
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="e.g., 5"
                        min="0.1"
                        step="0.1"
                        value={formData.estimatedWeight}
                        onChange={(e) => handleInputChange("estimatedWeight", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Preferred Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select
                        value={formData.preferredTime}
                        onValueChange={(value) => handleInputChange("preferredTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                          <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        placeholder="Your full name"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Phone *
                      </Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions or additional information..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6">
                    <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Submit Pickup Request
                        </div>
                      )}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
