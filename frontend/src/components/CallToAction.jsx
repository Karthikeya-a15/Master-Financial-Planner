import { Link } from "react-router-dom";
import { Button } from "./ui/Button"; // Ensure this path matches your project structure

export default function CallToAction() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Take Control of Your Financial Future?
            </h2>
            <p className="mx-auto max-w-[700px] md:text-xl">
              Join thousands of others who are on their path to financial freedom. Start your journey today with Master
              Financial Planner.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" variant="secondary">
              <Link to="/signup">Get Started for Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/contact">Schedule a Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
