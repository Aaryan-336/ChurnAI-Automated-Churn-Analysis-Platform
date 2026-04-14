import Sidebar from '@/components/layout/Sidebar';
import DemoBanner from '@/components/ui/DemoBanner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full bg-background/50 backdrop-blur-3xl overflow-hidden">
        <DemoBanner />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 relative">
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
