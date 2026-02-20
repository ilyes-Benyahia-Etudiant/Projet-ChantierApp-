import { Clock, Building2, ListTodo, Briefcase, Search } from 'lucide-react'
import ProjectCardEntreprise from './ProjectCardEntreprise'
import { useAuthCtx } from '../authContext/AuthContext'
import { useGetAllProjectsByUserId, useSearchProjects } from '../hooks/useProject'
import { formatDate } from '../utils/helpers'

const DashboardCardEntreprise = () => {
   const { user } = useAuthCtx();
   const { data: projects, isLoading } = useGetAllProjectsByUserId(user?.id ?? 0);
   const { data: available } = useSearchProjects('new')

   const entrepriseName = user && user.role === 'entreprise' && 'profile' in user
     ? (user.profile.raisonSociale || 'Entreprise')
     : 'Entreprise';

   if (isLoading) return <p>Chargement des chantiers...</p>;

  return (
        <div className="p-6 bg-white min-h-screen">
          {(() => {
            const actives = (projects ?? []).filter(p => !p.is_finished)
            const allTasks = (projects ?? []).flatMap(p => p.tasks ?? [])
            const inProgress = allTasks.filter(t => t.status === 'started')
            const todo = allTasks.filter(t => t.status === 'pending')
            const availableCount = (available ?? []).length
            return (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Bienvenue {entrepriseName} 🏢</h2>
                  <div className="flex gap-3">
                    <a
                      href="/chantiers"
                      className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
                    >
                      <Search size={18} />
                      Découvrir des chantiers
                    </a>
                    <a
                      href="/projets"
                      className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Mes chantiers
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
                    <Building2 className="text-gray-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Chantiers actifs</p>
                      <p className="text-2xl font-semibold">{actives.length}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
                    <ListTodo className="text-gray-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Tâches à faire</p>
                      <p className="text-2xl font-semibold">{todo.length}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
                    <Clock className="text-gray-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Tâches en cours</p>
                      <p className="text-2xl font-semibold">{inProgress.length}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
                    <Briefcase className="text-gray-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">Projets disponibles</p>
                      <p className="text-2xl font-semibold">{availableCount}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mes chantiers</h3>
                <div>
                  {projects?.map(project => (
                    <ProjectCardEntreprise
                      key={String(project.id)}
                      projectName={project.title}
                      projectDelay={formatDate(project.start_date)}
                      tradeBody={project.description}
                      customerName={project.customer?.profiles?.[0]?.name ?? 'Client inconnu'}
                    />
                  ))}
                  {(!projects || projects.length === 0) && (
                    <p className="text-gray-500">Aucun chantier pour le moment.</p>
                  )}
                </div>
              </>
            )
          })()}
        </div>
    )
};

export default DashboardCardEntreprise;
