import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Pause, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Subscription } from "@/types/subscription";
import { format } from "date-fns";

interface SubscriptionCardProps {
  subscription: Subscription;
  onUpdate: () => void;
}

const SubscriptionCard = ({ subscription, onUpdate }: SubscriptionCardProps) => {
  const handleDelete = async () => {
    const { error } = await supabase.from("subscriptions").delete().eq("id", subscription.id);

    if (error) {
      toast.error("Failed to delete subscription");
    } else {
      toast.success("Subscription deleted");
      onUpdate();
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = subscription.status === "active" ? "paused" : "active";
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: newStatus })
      .eq("id", subscription.id);

    if (error) {
      toast.error("Failed to update subscription");
    } else {
      toast.success(`Subscription ${newStatus === "active" ? "activated" : "paused"}`);
      onUpdate();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Entertainment: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
      Productivity: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      "Cloud Storage": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
      Music: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
      "Video Streaming": "bg-red-500/10 text-red-700 dark:text-red-300",
      Software: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
      Gaming: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
      Education: "bg-green-500/10 text-green-700 dark:text-green-300",
      News: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    };
    return colors[category] || "bg-gray-500/10 text-gray-700 dark:text-gray-300";
  };

  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{subscription.name}</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className={getCategoryColor(subscription.category)}>
                {subscription.category}
              </Badge>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleToggleStatus}>
                {subscription.status === "active" ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">
              ${Number(subscription.price).toFixed(2)}
            </span>
            <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
              {subscription.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="capitalize">{subscription.billing_cycle}</p>
            <p>Next billing: {format(new Date(subscription.next_billing_date), "MMM dd, yyyy")}</p>
          </div>
          {subscription.notes && (
            <p className="text-sm text-muted-foreground pt-2 border-t">{subscription.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
