import { Info } from 'lucide-react';

// Interface pour typer les props du composant
interface ProjectCardProps  {
  projectName: string;
  projectDelay: string;
  tradeBody: string;
  customerName: string;
}

const ProjectCardEntreprise: React.FC<ProjectCardProps> = ( props ) => {
  const { projectName, projectDelay, tradeBody, customerName } = props
  return (
    <div className="bg-gray-200 p-4 mb-2 rounded-lg flex items-center justify-between shadow-sm">
      <div className="flex w-3/4 items-center ">
        <div>
          <Info className="text-gray-600 mr-2" size={20} />
        </div>

        <div className="d-flex">
          <p className="font-semibold p-2 text-gray-800 ">{projectName}</p>
          <p className=" text-left text-sm p-2 text-gray-600 ">{customerName}</p>
        </div>
      </div>
      <div className="">
        <p className="text-sm font-medium grow p-2 text-gray-700"> {tradeBody}</p>
        <p className="text-sm font-medium p-2 text-gray-700">{projectDelay}</p>
      </div>
    </div>
  );
};

export default ProjectCardEntreprise;
