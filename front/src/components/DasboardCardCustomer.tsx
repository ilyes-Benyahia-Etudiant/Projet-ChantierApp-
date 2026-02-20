import { Plus, Calendar, CheckCircle2, Clock, ListTodo } from 'lucide-react'
import ProjectCardCustomer from './ProjectCardCustomer'
import { useAuthCtx } from '../authContext/AuthContext'
import { useGetAllProjectsByUserId } from '../hooks/useProject'
import { formatDate } from '../utils/helpers'

const DashboardCardCustomer = () => {
  const { user } = useAuthCtx()
  const { data: projects, isLoading } = useGetAllProjectsByUserId(user?.id ?? 0)

  const userName =
    user && user.role === 'customer' && 'profile' in user ? user.profile.name : 'Utilisateur'

  if (isLoading) return <p>Chargement des chantiers...</p>

  return (
    <div className="p-6 bg-white min-h-screen">
      {(() => {
        const allTasks = (projects ?? []).flatMap(p => p.tasks ?? [])
        const activeProjects = (projects ?? []).filter(p => !p.is_finished)
        const startedTasks = allTasks.filter(t => t.status === 'started')
        const pendingTasks = allTasks.filter(t => t.status === 'pending')
        const upcoming = [...allTasks]
          .filter(t => t.status !== 'finished')
          .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
          .slice(0, 5)

        return (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Bonjour, {userName} 👋</h2>
              <div className="flex gap-3">
                <a
                  href="/projets/new/project"
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
                >
                  <Plus size={18} />
                  Nouveau projet
                </a>
                <a
                  href="/projets"
                  className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Voir mes chantiers
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
                <Clock className="text-gray-600" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Chantiers actifs</p>
                  <p className="text-2xl font-semibold">{activeProjects.length}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
                <ListTodo className="text-gray-600" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Tâches à faire</p>
                  <p className="text-2xl font-semibold">{pendingTasks.length}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
                <CheckCircle2 className="text-gray-600" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Tâches en cours</p>
                  <p className="text-2xl font-semibold">{startedTasks.length}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
                <Calendar className="text-gray-600" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Échéances à venir</p>
                  <p className="text-2xl font-semibold">{upcoming.length}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mes chantiers</h3>
                <div className="space-y-3">
                  {projects?.map(project => (
                    <ProjectCardCustomer
                      key={project.id}
                      projectName={project.title}
                      projectDelay={formatDate(project.start_date)}
                      tradeBody={project.description}
                    />
                  ))}
                  {(!projects || projects.length === 0) && (
                    <p className="text-gray-500">Aucun chantier en cours.</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Prochains délais</h3>
                <div className="space-y-3">
                  {upcoming.map(t => (
                    <div key={t.id} className="p-4 border rounded-xl bg-gray-50">
                      <p className="font-medium text-gray-800">{t.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(t.end_date)}</p>
                    </div>
                  ))}
                  {upcoming.length === 0 && <p className="text-gray-500">Aucune échéance proche.</p>}
                </div>
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}

export default DashboardCardCustomer
