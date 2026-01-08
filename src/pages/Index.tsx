import Header from "@/components/Header";
import Hero3D from "@/components/Hero3D";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SeasonalBackground from "@/components/SeasonalBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Global seasonal background - stays behind everything */}
      <SeasonalBackground />
      
      <Header />
      <CartDrawer />
      <main>
        <Hero3D />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
