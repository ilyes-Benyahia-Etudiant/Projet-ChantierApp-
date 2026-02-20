import React, { useState } from 'react';
import { useSearchProjects, useAcceptProject } from '../../hooks/useProject';
import { useAuthCtx } from '../../authContext/AuthContext';
import type { Project } from '../../types/projects.type';

type FilterStatus = 'all' | 'new' | 'accepted' | 'finished';

const ProjectSearch: React.FC = () => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const { user } = useAuthCtx();
  const { data: projects, isLoading, isError } = useSearchProjects(filter);
  const { mutate: acceptProject, isPending: isAccepting } = useAcceptProject();

  const handleAcceptProject = (projectId: number) => {
    if (window.confirm("Voulez-vous accepter ce projet ?")) {
      acceptProject(projectId);
    }
  };

  const getStatusClasses = (project: Project) => {
    if (project.is_finished) return { text: 'Terminé', class: 'bg-green-500' };
    if (project.entreprise_id === user?.id) return { text: 'Accepté par vous', class: 'bg-blue-600' };
    if (project.entreprise_id !== null) return { text: 'Déjà accepté', class: 'bg-yellow-500' };
    return { text: 'Nouveau', class: 'bg-red-500' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Chargement des projets...</div>
      </div>
    );
  }

  if (isError) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-red-600">Erreur lors du chargement des projets.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
             Recherche de Projets
          </h1>
          <p className="text-lg text-gray-600">
            Filtrez les chantiers disponibles et acceptez ceux qui correspondent à vos besoins.
            {user?.role === 'entreprise' && user.profile?.raisonSociale && (
              <span className="font-semibold ml-2">Entreprise: {user.profile.raisonSociale}</span>
            )}
          </p>
        </header>

        <div className="bg-white p-4 shadow-lg rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Filtrer par statut</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-medium transition duration-150 
                ${filter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Tous les Projets
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-full font-medium transition duration-150 
                ${filter === 'new' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Nouveaux (Disponibles)
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 rounded-full font-medium transition duration-150 
                ${filter === 'accepted' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Acceptés par vous
            </button>
            <button
              onClick={() => setFilter('finished')}
              className={`px-4 py-2 rounded-full font-medium transition duration-150 
                ${filter === 'finished' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Projets Terminés
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => {
            const { text: statusText, class: statusClass } = getStatusClasses(project);
            const isAvailable = !project.is_finished && project.entreprise_id === null;
            
            return (
              <div 
                key={project.id} 
                className="bg-white p-6 rounded-xl shadow-xl transition duration-300 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusClass}`}
                    >
                      {statusText}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <p className="text-sm text-gray-500">
                    Début : <span className="font-semibold">{new Date(project.start_date).toLocaleDateString()}</span>
                  </p>
                   {project.address && (
                    <p className="text-sm text-gray-500">
                        Lieu : <span className="font-semibold">{project.address.city} ({project.address.zip_code})</span>
                    </p>
                   )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleAcceptProject(project.id)}
                    disabled={!isAvailable || isAccepting}
                    className={`w-full py-2 rounded-lg font-bold transition duration-200 
                      ${isAvailable 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                  >
                    {isAccepting && isAvailable ? 'Acceptation...' : 
                     isAvailable 
                      ? ' Accepter ce projet' 
                      : statusText === 'Accepté par vous' 
                        ? 'Mon Projet' 
                        : 'Indisponible'
                    }
                  </button>
                </div>
              </div>
            );
          })}
          
          {(!projects || projects.length === 0) && (
            <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-lg">
              <p className="text-xl text-gray-500">
                Aucun projet ne correspond au filtre **{filter.toUpperCase()}** actuel.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ProjectSearch;