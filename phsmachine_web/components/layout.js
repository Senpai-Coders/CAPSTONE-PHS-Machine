import NavBar from "./navbar";

export default function Layout({ children }) {
  return (
    <>
      <div className=" relative h-screen ">
        <NavBar />
        <main className="relative card bg-stone-50/5">
          <div className="p-5 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
