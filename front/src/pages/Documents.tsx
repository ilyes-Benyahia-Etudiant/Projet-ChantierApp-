import { NavLink, Outlet, useLocation } from "react-router-dom"
import Button from "../components/Buttons"
import { Plus, FileText, FileCheck2, Wallet } from "lucide-react"
import { useAuthCtx } from "../authContext/AuthContext"

export default function Documents() {
  const { user } = useAuthCtx()
  const location = useLocation()
  
  // Détecte l'onglet actif pour adapter le header
  const isInvoiceTab = location.pathname.includes('factures')

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header avec résumé rapide */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Wallet className="h-8 w-8 text-blue-600" />
                Gestion financière
              </h1>
              <p className="mt-2 text-gray-500 text-lg">
                Centralisez vos devis et factures pour une comptabilité simplifiée.
              </p>
            </div>
            {user?.role === 'entreprise' && !isInvoiceTab && (
              <div className="flex-shrink-0">
                <Button to="/documents/devis/new" className="shadow-lg shadow-blue-200">
                  <Plus size={20} className="mr-2" /> Nouveau Devis
                </Button>
              </div>
            )}
          </div>

          {/* Onglets Modernes */}
          <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl w-fit">
            <NavLink
              to="/documents/devis"
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`
              }
            >
              <FileText size={18} />
              Mes Devis
            </NavLink>

            <NavLink
              to="/documents/factures"
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`
              }
            >
              <FileCheck2 size={18} />
              Mes Factures
            </NavLink>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
