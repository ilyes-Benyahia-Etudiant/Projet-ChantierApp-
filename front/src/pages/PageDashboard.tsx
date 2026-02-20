import DashboardCardCustomer from '../components/DasboardCardCustomer';
import DashboardCardEntreprise from '../components/DashboardCardEntreprise';
import { useAuthCtx } from '../authContext/AuthContext';

const PageDashboard = () => {
  const { role } = useAuthCtx();

  const renderDashboardCard = () => {
    switch (role) {
      case 'customer':
        return <DashboardCardCustomer />;
      case 'entreprise':
        return <DashboardCardEntreprise />;
      case 'admin':
        return (
          <a
            href="/admin"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Aller au dashboard admin
          </a>
        );
      default:
        return <p>Chargement en cours...</p>;
    }
  };

  return (
    <div className="page-dashboard p-6">
      <h1>Tableau de Bord</h1>
      <hr />
      {renderDashboardCard()}
    </div>
  );
};

export default PageDashboard;
