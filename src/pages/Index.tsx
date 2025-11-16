import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Bell, PieChart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 mb-4 text-primary" />,
      title: "Track All Subscriptions",
      description: "Keep track of all your recurring expenses in one centralized dashboard",
    },
    {
      icon: <Bell className="h-8 w-8 mb-4 text-secondary" />,
      title: "Renewal Reminders",
      description: "Never miss a payment deadline with upcoming renewal notifications",
    },
    {
      icon: <PieChart className="h-8 w-8 mb-4 text-primary" />,
      title: "Spending Insights",
      description: "Visualize your subscription spending patterns and optimize your budget",
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 mb-4 text-secondary" />,
      title: "Easy Management",
      description: "Pause, cancel, or update subscriptions with just a few clicks",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Vibecoded
          </h1>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")}>Get Started</Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="text-center py-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Manage Your Subscriptions
            <br />
            Effortlessly
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track, organize, and optimize all your recurring subscriptions in one beautiful
            dashboard. Take control of your expenses today.
          </p>
          <Button size="lg" className="shadow-elegant" onClick={() => navigate("/auth")}>
            Start Free Today
          </Button>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-20">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center py-20">
          <Card className="max-w-4xl mx-auto shadow-elegant">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to take control?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of users who are already managing their subscriptions smarter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={() => navigate("/auth")}>
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Vibecoded. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
