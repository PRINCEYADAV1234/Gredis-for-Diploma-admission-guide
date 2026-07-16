import { Link } from "react-router-dom";
import { useSession } from "@/lib/auth";
import { motion } from "framer-motion";

export function SiteNav() {
  const user = useSession();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight">
            GREDIS
          </Link>
          <div className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <Link to="/features" className="hover:text-foreground transition-colors">Features</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:opacity-90"
            >
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-primary transition-colors hover:bg-brand hover:ring-brand hover:text-brand-foreground"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
