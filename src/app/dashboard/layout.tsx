export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-56px)]">
      <div className="max-w-3xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
