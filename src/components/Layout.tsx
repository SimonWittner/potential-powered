const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#1A0F0F]">
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;