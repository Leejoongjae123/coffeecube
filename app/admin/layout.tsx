import Header from "@/components/header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center bg-white">
        <Header />
        <div className=" flex flex-col w-full max-w-[1668px]">
          {children}
        </div>

       
      </div>
    </main>
  );
}
