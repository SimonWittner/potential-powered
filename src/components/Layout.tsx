import { Link } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#1A0F0F]">
      <header className="p-4 fixed top-0 right-0 z-50 w-fit">
        <Link to="/">
          <img 
            src="/lovable-uploads/01a4e2f8-dfea-4c95-8dee-fe6cbabd21d4.png" 
            alt="Lumera Logo" 
            className="h-12 w-auto rounded-lg"
          />
        </Link>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;