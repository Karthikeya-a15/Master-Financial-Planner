import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Quotes from "../components/landing/Quotes";
import CallToAction from "../components/landing/CallToAction";
import Footer from "../components/landing/Footer"
import HomeNavbar from "../components/landing/HomeNavbar";

export default function Landing(){
  return <>
    <div className="flex flex-col min-h-screen">
        <HomeNavbar />
        <main className="flex-grow">
          <Hero />
          <Features />
          <Quotes />
          <CallToAction />
        </main>
        <Footer />
    </div>
  </>
}
