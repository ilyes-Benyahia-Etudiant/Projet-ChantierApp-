
import { useParams, useNavigate } from 'react-router-dom'
import CreateDevisForm from '../components/Devis/CreateDevisForm'

const CreateDevis = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const projectId = id ? parseInt(id) : undefined

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <CreateDevisForm
          projectId={projectId}
          onCreated={() => {
            if (projectId) {
              navigate(`/projets/${projectId}/tasks`)
            } else {
              navigate(`/documents/devis`)
            }
          }}
        />
      </div>
    </div>
  )
};

export default CreateDevis;
