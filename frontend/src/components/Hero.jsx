import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import dashboard2 from "../assets/dashboard2.jpg"

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Your Path to Financial Freedom
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Darw-Invest helps you take control of your finances, build wealth, and achieve freedom.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/signup">
                <Button size="lg">Start Your Journey</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={dashboard2}
              className="max-w-[500px] h-auto rounded-lg object-cover"
              alt="Financial freedom illustration"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
