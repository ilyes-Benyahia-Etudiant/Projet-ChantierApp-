import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../Buttons';
import { ArrowLeft } from 'lucide-react';
import type { Task,  } from '../../../types/task.type';
import { useCreateTask } from '../../../hooks/useProject';

const initialTaskState: Task = {
    id: 0,
    title: '',
    description: '',
    user_id: null,
    status: 'pending',
    start_date: '',
    end_date: '',
    project_id: 0,
};

export const CreateTask = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const createTaskMutation = useCreateTask();

    const projectId = parseInt(id || '0', 10);

    const [taskData, setTaskData] = useState<Task>({
        ...initialTaskState,
        project_id: projectId,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTaskData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setFeedback('');

        const body = {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            start_date: new Date(taskData.start_date).toISOString(),
            end_date: new Date(taskData.end_date).toISOString(),
            user_id: taskData.user_id,
            project_id: projectId,
        };

        createTaskMutation.mutate({ project_id: projectId, body }, {
            onSuccess: () => {
                setIsSaving(false);
                setFeedback('✅ Tâche créée avec succès ! Redirection...');
                setTimeout(() => {
                    navigate(`/projets/${id}`);
                }, 1000);
            },
            onError: (error) => {
                setIsSaving(false);
                setFeedback(`❌ Erreur: ${error.message}`);
            }
        });
    };

    return (
        <div className='flex justify-between'>
            <div className=''></div>

            <div className="p-4 bg-white min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Créer une Nouvelle Tâche pour le Projet n°{projectId}
                </h2>

                {feedback && (
                    <div className={`mb-4 p-3 text-sm rounded-lg ${feedback.includes('Erreur') ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}`}>
                        {feedback}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Champ Nom de la Tâche */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Nom de la Tâche</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={taskData.title}
                            onChange={handleChange}
                            placeholder="Ex: Mise en place du design"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    {/* Champ Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            value={taskData.description}
                            onChange={handleChange}
                            placeholder="Ex: Développement Front-end"
                            required
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>


                    {/* Champ Statut */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
                        <select
                            name="status"
                            id="status"
                            value={taskData.status}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="pending">En attente</option>
                            <option value="started">Démarrée</option>
                            <option value="finished">Terminée</option>
                            <option value="stopped">Arrêtée</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Champ Date de Début */}
                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Date de Début</label>
                            <input
                                type="date"
                                name="start_date"
                                id="start_date"
                                value={taskData.start_date}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>

                        {/* Champ Délai */}
                        <div>
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Date de Fin (Délai)</label>
                            <input
                                type="date"
                                name="end_date"
                                id="end_date"
                                value={taskData.end_date}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>

                    {/* Boutons d'Action */}
                    <div className="flex justify-between pt-4">
                        <Button to={`/projets/${id}`} variant="secondary">
                            <ArrowLeft size={20} /> Annuler
                        </Button>
                        <Button type="submit" disabled={isSaving || createTaskMutation.isPending}>
                            {isSaving || createTaskMutation.isPending ? 'Création...' : 'Créer la Tâche'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className=''></div>
        </div>

    );
};