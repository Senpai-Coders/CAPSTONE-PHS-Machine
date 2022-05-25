import Sidebar from "./sidebar";

export default function Layout({ children }) {
  return (
    <>
      <div className="flex relative h-screen ">
        <Sidebar />
        <main className="relative w-full h-full overflow-y-auto card bg-stone-50/5">
          <div className="p-5 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
