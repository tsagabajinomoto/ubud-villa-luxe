import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Loader2, X, Upload } from "lucide-react";
import { useAdminVillas } from "@/hooks/useAdmin";
import { formatCurrency } from "@/utils/booking";
import { toast } from "@/hooks/use-toast";

const AdminVillas = () => {
  const { villas, loading, createVilla, updateVilla, deleteVilla } = useAdminVillas();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVilla, setEditingVilla] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    short_description: "",
    price_per_night: 0,
    capacity: 4,
    bedrooms: 2,
    bathrooms: 2,
    location: "",
    images: [""],
    amenities: [""],
    is_available: true,
    cleaning_fee: 0,
    service_fee: 0,
    minimum_stay: 1,
  });

  const filteredVillas = villas.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingVilla(null);
    setFormData({
      name: "",
      tagline: "",
      description: "",
      short_description: "",
      price_per_night: 0,
      capacity: 4,
      bedrooms: 2,
      bathrooms: 2,
      location: "",
      images: [""],
      amenities: [""],
      is_available: true,
      cleaning_fee: 0,
      service_fee: 0,
      minimum_stay: 1,
    });
    setShowModal(true);
  };

  const openEditModal = (villa: any) => {
    setEditingVilla(villa);
    setFormData({
      name: villa.name,
      tagline: villa.tagline || "",
      description: villa.description,
      short_description: villa.short_description || "",
      price_per_night: villa.price_per_night,
      capacity: villa.capacity,
      bedrooms: villa.bedrooms,
      bathrooms: villa.bathrooms,
      location: villa.location,
      images: villa.images?.length ? villa.images : [""],
      amenities: villa.amenities?.length ? villa.amenities : [""],
      is_available: villa.is_available,
      cleaning_fee: villa.cleaning_fee || 0,
      service_fee: villa.service_fee || 0,
      minimum_stay: villa.minimum_stay || 1,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.location || !formData.price_per_night) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const cleanedData = {
        ...formData,
        images: formData.images.filter((img) => img.trim() !== ""),
        amenities: formData.amenities.filter((a) => a.trim() !== ""),
      };

      if (editingVilla) {
        await updateVilla(editingVilla.id, cleanedData);
        toast({ title: "Success", description: "Villa updated successfully" });
      } else {
        await createVilla(cleanedData);
        toast({ title: "Success", description: "Villa created successfully" });
      }
      setShowModal(false);
    } catch (err) {
      toast({ title: "Error", description: "Failed to save villa", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this villa?")) return;
    
    const { error } = await deleteVilla(id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete villa", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Villa deleted successfully" });
    }
  };

  const addArrayItem = (field: "images" | "amenities") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const updateArrayItem = (field: "images" | "amenities", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeArrayItem = (field: "images" | "amenities", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Villas</h1>
          <p className="text-muted-foreground">Manage your villa listings</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Villa
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search villas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Villas Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVillas.map((villa, index) => (
          <motion.div
            key={villa.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-2xl overflow-hidden border border-border group"
          >
            <div className="aspect-video relative">
              <img
                src={villa.images?.[0] || "https://via.placeholder.com/400x300"}
                alt={villa.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openEditModal(villa)}
                  className="p-3 bg-background rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(villa.id)}
                  className="p-3 bg-background rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <span
                className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                  villa.is_available
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
                }`}
              >
                {villa.is_available ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {villa.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{villa.location}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">
                  {formatCurrency(villa.price_per_night)}
                  <span className="text-muted-foreground font-normal text-sm">/night</span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {villa.bedrooms} BR • {villa.bathrooms} BA
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVillas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No villas found</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background rounded-2xl w-full max-w-2xl my-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-xl font-semibold">
                  {editingVilla ? "Edit Villa" : "Add New Villa"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Villa Serenity"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ubud, Bali"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Where tradition meets luxury"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Short Description</label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Stunning rice terrace views..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Full Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Detailed description of the villa..."
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price/Night *</label>
                    <input
                      type="number"
                      value={formData.price_per_night}
                      onChange={(e) => setFormData({ ...formData, price_per_night: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cleaning Fee</label>
                    <input
                      type="number"
                      value={formData.cleaning_fee}
                      onChange={(e) => setFormData({ ...formData, cleaning_fee: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Fee</label>
                    <input
                      type="number"
                      value={formData.service_fee}
                      onChange={(e) => setFormData({ ...formData, service_fee: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Stay</label>
                    <input
                      type="number"
                      value={formData.minimum_stay}
                      onChange={(e) => setFormData({ ...formData, minimum_stay: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">Images (URLs)</label>
                  {formData.images.map((img, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => updateArrayItem("images", i, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {formData.images.length > 1 && (
                        <button
                          onClick={() => removeArrayItem("images", i)}
                          className="p-3 text-destructive hover:bg-destructive/10 rounded-xl"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("images")}
                    className="text-primary text-sm hover:underline"
                  >
                    + Add another image
                  </button>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium mb-2">Amenities</label>
                  {formData.amenities.map((amenity, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => updateArrayItem("amenities", i, e.target.value)}
                        placeholder="WiFi, Pool, etc."
                        className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {formData.amenities.length > 1 && (
                        <button
                          onClick={() => removeArrayItem("amenities", i)}
                          className="p-3 text-destructive hover:bg-destructive/10 rounded-xl"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("amenities")}
                    className="text-primary text-sm hover:underline"
                  >
                    + Add another amenity
                  </button>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_available" className="text-sm font-medium">
                    Villa is available for booking
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingVilla ? "Save Changes" : "Create Villa"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVillas;
