import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../components/Buttons';
import { TaskComponent } from '../components/Projects/Tasks/Task';
import { useFindProjectWithTasks } from '../hooks/useProject';
import { useAuthCtx } from '../authContext/AuthContext';

export const ProjectTasks = () => {

    const { id } = useParams<{ id: string }>();
    const projectId = parseInt(id || '0', 10);
    const { data: project, isLoading } = useFindProjectWithTasks(projectId);
    const { user } = useAuthCtx();

    // Extraction type-safe du nom du user
    const userName = user && user.role === 'customer' && 'profile' in user
        ? user.profile.name
        : (user && user.role === 'entreprise' && 'profile' in user ? user.profile.raisonSociale : 'Utilisateur');

    if (isLoading) return <p>Chargement...</p>;
    if (!project) return <p>Projet introuvable.</p>;

    return (
        <div className="p-4 bg-white ">

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bonjour, {userName} 👋</h2>
                <div className="flex gap-3">
                    <Button to={`/projets/${id}/devis/new`} variant="secondary"><Plus size={20} />Créer un Devis</Button>
                    <Button to={`/projets/${id}/new`}><Plus size={20} />Nouvelle Tâche</Button>
                </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-500 mb-4">
                Tâches pour le Projet : {project.title}
            </h3>

            <div className="space-y-3">
                {project.tasks && project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                        <TaskComponent key={task.id} task={task} />
                    ))
                ) : (
                    <p className="text-gray-500 italic">
                        Aucune tâche trouvée pour ce projet.
                    </p>
                )}
            </div>

        </div>
    );
};