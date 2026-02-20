import { useState } from 'react';
import { Gantt, type Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { format } from 'date-fns';
import Button from '../components/Buttons';
import { Plus, Play, CheckSquare, Clock } from 'lucide-react';
import { useAuthCtx } from '../authContext/AuthContext';

// Types pour notre adaptation
interface PlanningTask extends Task {
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  assignee?: string;
}

// Données mockées pour l'exemple (à remplacer par les vraies données)
const MOCK_TASKS: PlanningTask[] = [
  {
    start: new Date(2024, 2, 1),
    end: new Date(2024, 2, 5),
    name: 'Excavation',
    id: 'Task 1',
    type: 'task',
    progress: 100,
    isDisabled: false,
    styles: { progressColor: '#10b981', progressSelectedColor: '#059669' },
    status: 'completed',
    assignee: 'Jean BTP'
  },
  {
    start: new Date(2024, 2, 6),
    end: new Date(2024, 2, 10),
    name: 'Fondations',
    id: 'Task 2',
    type: 'task',
    progress: 45,
    isDisabled: false,
    styles: { progressColor: '#ef4444', progressSelectedColor: '#dc2626' },
    status: 'on_hold',
    assignee: 'Maçonnerie & Co'
  },
  {
    start: new Date(2024, 2, 11),
    end: new Date(2024, 2, 20),
    name: 'Ossature',
    id: 'Task 3',
    type: 'task',
    progress: 0,
    isDisabled: false,
    styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' },
    status: 'pending',
    assignee: 'Charpente Pro'
  },
  {
    start: new Date(2024, 2, 15),
    end: new Date(2024, 3, 5),
    name: 'Toiture',
    id: 'Task 4',
    type: 'task',
    progress: 0,
    isDisabled: false,
    styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' },
    status: 'pending',
    assignee: 'Couverture 2000'
  },
  {
    start: new Date(2024, 3, 10),
    end: new Date(2024, 3, 25),
    name: 'Finitions',
    id: 'Task 5',
    type: 'task',
    progress: 0,
    isDisabled: false,
    styles: { progressColor: '#94a3b8', progressSelectedColor: '#64748b' },
    status: 'pending',
    assignee: 'Peinture Express'
  }
];

export default function Planning() {
  const { user } = useAuthCtx();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<PlanningTask[]>(MOCK_TASKS);

  // Gestion de l'affichage des dates dans le header du Gantt
  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? { ...t, hideChildren: task.hideChildren } : t)));
    console.log("On expander click");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'in_progress': return 'En cours';
      case 'on_hold': return 'En attente';
      default: return 'À faire';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header de la page */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              Planning du chantier
            </h1>
            <p className="mt-2 text-gray-500 text-lg">
              Projet Maison Individuelle <span className="text-sm bg-gray-100 px-2 py-1 rounded-full ml-2">#PRJ-2024-001</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setViewMode(ViewMode.Day)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === ViewMode.Day ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Jours
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.Week)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === ViewMode.Week ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Semaines
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.Month)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === ViewMode.Month ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Mois
              </button>
            </div>
            {user?.role === 'entreprise' && (
              <Button to="/projets/tasks/new" className="shadow-lg shadow-blue-200">
                <Plus size={20} className="mr-2" /> Nouvelle tâche
              </Button>
            )}
          </div>
        </div>

        {/* Section Gantt */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Vue d'ensemble chronologique</h2>
            <div className="flex gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div> En cours
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div> À faire
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> En attente
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div style={{ minWidth: '1000px' }}>
              <Gantt
                tasks={tasks}
                viewMode={viewMode}
                onDateChange={(task: Task) => console.log('Date changed', task)}
                onDelete={(task: Task) => console.log('Delete', task)}
                onProgressChange={(task: Task) => console.log('Progress', task)}
                onDoubleClick={(task: Task) => console.log('Double click', task)}
                onExpanderClick={handleExpanderClick}
                listCellWidth="155px"
                columnWidth={viewMode === ViewMode.Month ? 300 : 65}
                barFill={60}
                ganttHeight={300}
                locale="fr"
              />
            </div>
          </div>
        </div>

        {/* Section Liste des Tâches */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CheckSquare className="text-blue-600" size={20}/>
              Liste détaillée des tâches
            </h2>
            <div className="flex gap-2 text-xs font-medium">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> En cours
              </span>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div> À faire
              </span>
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> En attente
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div> Terminée
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-6 font-medium">Tâche</th>
                  <th className="p-6 font-medium">Début</th>
                  <th className="p-6 font-medium">Fin</th>
                  <th className="p-6 font-medium">Assigné à</th>
                  <th className="p-6 font-medium">Statut</th>
                  <th className="p-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-8 rounded-full ${
                          task.status === 'completed' ? 'bg-gray-400' :
                          task.status === 'on_hold' ? 'bg-red-500' :
                          task.status === 'in_progress' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="font-semibold text-gray-900">{task.name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-gray-600 text-sm">
                      {format(task.start, 'dd/MM/yyyy')}
                    </td>
                    <td className="p-6 text-gray-600 text-sm">
                      {format(task.end, 'dd/MM/yyyy')}
                    </td>
                    <td className="p-6 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {task.assignee?.charAt(0)}
                        </div>
                        {task.assignee || 'Non assigné'}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {task.status !== 'completed' && (
                          <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                            <Play size={18} />
                          </button>
                        )}
                        <Button to={`/project/task/edit/${task.id}`} variant="secondary" className="px-4 py-2 text-xs">
                          Détails
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}