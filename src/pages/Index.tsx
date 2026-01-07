import Header from "@/components/Header";
import Hero3D from "@/components/Hero3D";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <Hero3D />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
