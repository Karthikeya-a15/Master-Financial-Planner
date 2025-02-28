import { PiggyBank, TrendingUp, Calendar, BarChart4, Briefcase, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <PiggyBank className="h-10 w-10 text-primary" />,
      title: "Smart Budgeting",
      description: "Create personalized budgets that help you save more without sacrificing your lifestyle.",
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      title: "Investment Strategies",
      description: "Access proven investment strategies tailored to your risk tolerance and financial goals.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Retirement Planning",
      description: "Plan your path to early retirement with our comprehensive retirement calculators and tools.",
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-primary" />,
      title: "Wealth Tracking",
      description: "Monitor your net worth and track your progress toward financial independence.",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: "Tax Optimization",
      description: "Minimize your tax burden with strategies designed to keep more money in your pocket.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Financial Security",
      description: "Build a safety net that protects you and your family from unexpected financial challenges.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              How We Help You Achieve Financial Freedom
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our comprehensive suite of tools and resources is designed to guide you on your journey to financial
              independence.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              {feature.icon}
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
