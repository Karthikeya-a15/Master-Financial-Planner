import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-5">
        <Link to="/" className="font-bold text-xl flex items-center">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReWkg8SEqeqAtwEi8KzlVLs8vVNkE5sOAtyw&s" alt="Darwinbox logo" className="max-w-[50px] h-auto rounded-lg object-cover" />
          <span className="text-primary mr-1"> 
          DarwInvest
          </span> 
            
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">About</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </nav>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <div className="container py-4 flex flex-col gap-4">
              <Link to="/" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
