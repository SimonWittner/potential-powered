import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

const Header = ({ title, subtitle, showBackButton }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                className="text-white hover:text-white/80"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-gray-300 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          <Link to="/">
            <img
              src="/lovable-uploads/01a4e2f8-dfea-4c95-8dee-fe6cbabd21d4.png"
              alt="Lumera Logo"
              className="h-12 w-auto"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
