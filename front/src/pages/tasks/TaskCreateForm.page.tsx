import { useParams, useNavigate } from 'react-router-dom';
import { useCreateTask } from '../../hooks/useProject';
import { useAuthCtx } from '../../authContext/AuthContext';
import { TaskForm } from './TaskForm.page';

export const CreateTaskPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthCtx();
  
  const createTask = useCreateTask();

  const handleCreate = (formData: any) => {
    // 1. On prépare le corps de la tâche (Omit id, created_at, updated_at)
    const taskBody = {
      ...formData,
      project_id: Number(projectId),
      user_id: user?.id || null,
     
    };
     console.log('taskBody', taskBody)

    // 2. On appelle la mutation avec la structure attendue par votre hook
    createTask.mutate(
      {
        project_id: Number(projectId),
        body: taskBody,
      },
      {
        onSuccess: () => {
          // On redirige vers la vue du projet pour voir la nouvelle tâche
          navigate(`/projets`);
        },
      }
    );
  };

  return (
    <TaskForm 
      title="Ajouter une nouvelle tâche"
      onSubmit={handleCreate}
      isLoading={createTask.isPending}
      onCancel={() => navigate(-1)}
      // Données par défaut pour le formulaire
      initialData={{ 
        project_id: Number(projectId), 
        status: 'pending' 
      }}
    />
  );
};