import { useApp, roleNav, pageLabels, Page } from "../context/AppContext";

export default function Sidebar() {
  const { currentUser, currentPage, setCurrentPage, tr, setSidebarOpen, sidebarOpen } = useApp();
  if (!currentUser) return null;

  const pages = roleNav[currentUser.role];

  const roleColors: Record<string, string> = {
    patient: "bg-blue-100 text-blue-800",
    health_worker: "bg-emerald-100 text-emerald-800",
    doctor: "bg-violet-100 text-violet-800",
    facility_admin: "bg-amber-100 text-amber-800",
    super_admin: "bg-red-100 text-red-800",
  };

  const roleLabels: Record<string, string> = {
    patient: "Patient",
    health_worker: "Health Worker",
    doctor: "Doctor",
    facility_admin: "Facility Admin",
    super_admin: "Super Admin",
  };

  const nav = (page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-stone-900 text-white flex flex-col z-40
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-stone-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-teal-600 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-heading font-700 leading-tight">RuralCare OS</div>
              <div className="text-xs text-stone-400 leading-tight font-mono">v2.4.1</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-5 py-3 border-b border-stone-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{currentUser.name}</div>
              <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${roleColors[currentUser.role]}`}>
                {roleLabels[currentUser.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-widest px-2 mb-2">Menu</div>
          {pages.map((page) => {
            const { icon, label } = pageLabels[page];
            const active = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => nav(page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium mb-0.5 transition-colors text-left ${
                  active
                    ? "bg-teal-600 text-white"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                }`}
              >
                <span className="text-base w-5 text-center">{icon}</span>
                <span>{tr(label)}</span>
                {page === "followups" && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
                )}
                {page === "medicines" && (
                  <span className="ml-auto bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ABDM badge */}
        <div className="px-5 py-3 border-t border-stone-700">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
            <span>ABDM / FHIR R4 Ready</span>
          </div>
          <div className="text-xs text-stone-500 mt-1 font-mono">Bhimpur PHC · MH-WARD-001</div>
        </div>
      </aside>
    </>
  );
}
