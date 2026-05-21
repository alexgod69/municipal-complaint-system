import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintAPI } from '../api'
import toast from 'react-hot-toast'
import { Upload, X, Send, MapPin, Loader2, Navigation } from 'lucide-react'

const CATEGORIES = [
  'Garbage Collection', 'Road Repair', 'Water Supply',
  'Drainage Issues', 'Street Light Problems', 'Illegal Construction',
  'Pollution Complaints', 'Public Toilet Maintenance',
]

async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { 'Accept-Language': 'en' } }
  )
  const data = await res.json()
  // Build a readable address from the response
  const a = data.address || {}
  const parts = [
    a.road || a.pedestrian || a.footway,
    a.suburb || a.neighbourhood || a.quarter,
    a.city || a.town || a.village || a.county,
    a.state,
  ].filter(Boolean)
  return parts.join(', ') || data.display_name || ''
}

export default function SubmitComplaint() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ category: '', description: '', location: '' })
  const [coords, setCoords] = useState(null)        // { lat, lng }
  const [locating, setLocating] = useState(false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported by your browser')

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const address = await reverseGeocode(latitude, longitude)
          setCoords({ lat: latitude, lng: longitude })
          setForm(f => ({ ...f, location: address }))
          toast.success('Location detected!')
        } catch {
          // GPS worked but geocoding failed — still save coordinates
          setCoords({ lat: latitude, lng: longitude })
          setForm(f => ({ ...f, location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }))
          toast.success('Location detected (no address found)')
        } finally {
          setLocating(false)
        }
      },
      (err) => {
        setLocating(false)
        const messages = {
          1: 'Location permission denied. Please allow location access.',
          2: 'Location unavailable. Try again.',
          3: 'Location request timed out.',
        }
        toast.error(messages[err.code] || 'Could not get location')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB')
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => { setImage(null); setPreview(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.category) return toast.error('Please select a category')
    if (form.description.length < 20) return toast.error('Description must be at least 20 characters')

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('category', form.category)
      fd.append('description', form.description)
      fd.append('location', form.location)
      if (coords) {
        fd.append('lat', coords.lat)
        fd.append('lng', coords.lng)
      }
      if (image) fd.append('image', image)

      const res = await complaintAPI.submit(fd)
      toast.success(`Complaint #${res.data.complaintId} submitted!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">File a Complaint</h1>
          <p className="text-muted text-sm mt-1">Provide details and we'll route it to the right department</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Category */}
            <div>
              <label className="block text-sm text-muted mb-2">Category <span className="text-red-400">*</span></label>
              <select className="input-field" value={form.category} onChange={set('category')} required>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-muted mb-2">
                Description <span className="text-red-400">*</span>
                <span className="text-xs ml-2">({form.description.length}/500)</span>
              </label>
              <textarea
                className="input-field resize-none"
                rows={5}
                placeholder="Describe the issue in detail... (min. 20 characters)"
                value={form.description}
                onChange={set('description')}
                maxLength={500}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-muted mb-2">Location / Address</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    className="input-field pl-9"
                    placeholder="Enter address or use GPS detect"
                    value={form.location}
                    onChange={(e) => {
                      set('location')(e)
                      if (coords) setCoords(null) // manual edit clears GPS coords
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={locating}
                  title="Detect my location"
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
                    ${coords
                      ? 'bg-accent-green/10 border-accent-green/40 text-accent-green'
                      : 'border-border text-muted hover:border-accent-blue/50 hover:text-white'
                    }`}
                >
                  {locating
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Navigation size={16} className={coords ? 'fill-current' : ''} />
                  }
                  {locating ? 'Locating…' : coords ? 'Located' : 'Detect'}
                </button>
              </div>

              {/* Coordinates badge */}
              {coords && (
                <div className="mt-2 flex items-center gap-2 text-xs text-accent-green">
                  <MapPin size={12} />
                  <span>GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
                  <button
                    type="button"
                    onClick={() => { setCoords(null); setForm(f => ({ ...f, location: '' })) }}
                    className="text-muted hover:text-red-400 ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm text-muted mb-2">Upload Photo (optional, max 5MB)</label>
              {preview ? (
                <div className="relative inline-block">
                  <img src={preview} alt="preview" className="w-40 h-40 object-cover rounded-lg border border-border" />
                  <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent-blue/40 transition-colors">
                  <Upload size={24} className="text-muted mb-2" />
                  <span className="text-sm text-muted">Click to upload image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
                </label>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Send size={16} /> Submit Complaint</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
