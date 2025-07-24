import { useLocation, Link } from "wouter";
import { useEffect } from "react";

const NotFound = () => {
  const [location] = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location
    );
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Paj la pa egziste</p>
        <Link href="/" className="text-primary hover:text-primary/80 underline">
          Retounen nan Dashboard la
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
