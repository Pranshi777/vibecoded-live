import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const subscriptionSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().positive({ message: "Price must be greater than 0" }),
  billing_cycle: z.enum(["monthly", "yearly", "weekly"]),
  next_billing_date: z.string().min(1, { message: "Next billing date is required" }),
  notes: z.string().max(500).optional(),
});

interface AddSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddSubscriptionDialog = ({ open, onOpenChange, onSuccess }: AddSubscriptionDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    billing_cycle: "monthly",
    next_billing_date: "",
    notes: "",
  });

  const categories = [
    "Entertainment",
    "Productivity",
    "Cloud Storage",
    "Music",
    "Video Streaming",
    "Software",
    "Gaming",
    "Education",
    "News",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationData = {
      ...formData,
      price: parseFloat(formData.price),
      notes: formData.notes || undefined,
    };

    const result = subscriptionSchema.safeParse(validationData);

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to add subscriptions");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("subscriptions").insert([{
      user_id: user.id,
      name: result.data.name,
      category: result.data.category,
      price: result.data.price,
      billing_cycle: result.data.billing_cycle,
      next_billing_date: result.data.next_billing_date,
      notes: result.data.notes || null,
    }]);

    if (error) {
      toast.error("Failed to add subscription");
    } else {
      toast.success("Subscription added successfully!");
      setFormData({
        name: "",
        category: "",
        price: "",
        billing_cycle: "monthly",
        next_billing_date: "",
        notes: "",
      });
      onOpenChange(false);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
          <DialogDescription>
            Add a new subscription to track your recurring expenses
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subscription Name</Label>
              <Input
                id="name"
                placeholder="Netflix, Spotify, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="9.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing_cycle">Billing Cycle</Label>
                <Select
                  value={formData.billing_cycle}
                  onValueChange={(value) =>
                    setFormData({ ...formData, billing_cycle: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_billing_date">Next Billing Date</Label>
              <Input
                id="next_billing_date"
                type="date"
                value={formData.next_billing_date}
                onChange={(e) => setFormData({ ...formData, next_billing_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Subscription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionDialog;
