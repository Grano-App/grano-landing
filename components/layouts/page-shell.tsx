import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[720px] px-6 py-20 md:py-[120px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
