import { useAuthCtx } from "../authContext/AuthContext";
import CustomerProfileCard from "../components/CustomerProfileCard";
import EntrepriseProfileCard from "../components/EntrepriseProfileCard";
import { useFindUserByIdwithProfile } from "../hooks/useUser";

//En attendant d'avoir une vrai bdd d'utilisateurs, on force le mock
const UserProfile = () => {
  const { user } = useAuthCtx();

  const {
    data: userData,
    isLoading,
    error,
  } = useFindUserByIdwithProfile(user?.id || 0);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error.message}</div>;
  }

  if (!userData || userData.role === "admin") {
    return <div>Aucune donnée de profil disponible</div>;
  }

  return (
    <main className=" flex items-center">
      <div className="w-full">
        <div className="max-w-full md:max-w-[70%] lg:max-w-[50%] mx-auto px-4 sm:px-6 lg:px-10 mt-10 mb-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              Profil utilisateur
            </h1>
            <p className="text-slate-600 mt-1 text-sm">
              Visualisation des informations du compte
            </p>
          </header>
        </div>

        {userData.role === "entreprise" ? (
          <EntrepriseProfileCard
            id={userData.profile.id}
            raisonSociale={userData.profile.raisonSociale}
            siret={userData.profile.siret}
            firstName={userData.profile.firstName}
            name={userData.profile.name}
            telephone={userData.profile.telephone}
            address={userData.profile.address}
            professions={userData.profile.professions}
            email={userData.email}
          />
        ) : (
          <CustomerProfileCard
            id={userData.profile.id}
            firstName={userData.profile.firstName}
            name={userData.profile.name}
            telephone={userData.profile.telephone}
            address={userData.profile.address}
            email={userData.email}
          />
        )}
      </div>
    </main>
  );
};
export default UserProfile;
