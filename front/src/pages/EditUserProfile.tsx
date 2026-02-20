import { useNavigate } from "react-router-dom"
import CustomerProfileForm from "../components/CustomerProfileForm"
import EntrepriseProfileForm from "../components/EntrepriseProfileForm"
import { useAuthCtx } from "../authContext/AuthContext"
import { useFindUserByIdwithProfile, useUpdateUserProfile, useAddProfessionsToProfile, useRemoveProfessionFromProfile } from "../hooks/useUser"
import { useGetAllProfessions } from "../hooks/useProfession"

const EditUserProfile = () => {
  const { user } = useAuthCtx()
  const navigate = useNavigate()

  const { data: userData, isLoading, error } = useFindUserByIdwithProfile(user?.id || 0)
  const { data: allProfessions } = useGetAllProfessions()
  const updateProfile = useUpdateUserProfile()
  const addProfessions = useAddProfessionsToProfile()
  const removeProfession = useRemoveProfessionFromProfile()

  const handleSuccessfulUpdate = () => {
    alert("Mise à jour réussie")
    navigate('/profile')
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur : {error.message}</div>
  }

  if (!userData || userData.role === "admin") {
    return <div>Aucune donnée de profil disponible</div>
  }

  return (
    <main className="flex items-center">
      <div className="w-full">

        <div className="max-w-full md:max-w-[70%] lg:max-w-[50%] mx-auto px-4 sm:px-6 lg:px-10 mt-10 mb-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              Modifier le profil utilisateur
            </h1>
            <p className="text-slate-600 mt-1 text-sm">
              Mets à jour les informations du compte
            </p>
          </header>
        </div>

        <div className="max-w-full md:max-w-[70%] lg:max-w-[50%] mx-auto px-4 sm:px-6 lg:px-10 pb-12">
          {userData.role === "customer" && (
            <CustomerProfileForm
              initial={userData.profile}
              onSubmit={(values) => {
                // Filtrer les champs pour ne garder que ceux acceptés par le backend
                // @ts-ignore - email n'existe pas sur CustomerProfile mais peut être dans values
                const { id, email, address, ...profileData } = values
                const { id: addressId, ...addressData } = address || {}

                updateProfile.mutate(
                  {
                    profileId: userData.profile.id,
                    userId: userData.id,
                    data: {
                      ...profileData,
                      address: addressData
                    }
                  },
                  {
                    onSuccess: handleSuccessfulUpdate,
                    onError: (err) => {
                      alert(`Erreur lors de la mise à jour : ${err.message}`)
                    }
                  }
                )
              }}
            />
          )}

          {userData.role === "entreprise" && (
            <EntrepriseProfileForm
              initial={userData.profile}
              onSubmit={async (values) => {
                // Filtrer les champs pour ne garder que ceux acceptés par le backend
                // @ts-ignore - email n'existe pas sur EntrepriseProfile mais peut être dans values
                const { id, email, address, professions, ...profileData } = values
                const { id: addressId, ...addressData } = address || {}

                try {
                  // 1. Mettre à jour le profile
                  await updateProfile.mutateAsync({
                    profileId: userData.profile.id,
                    userId: userData.id,
                    data: {
                      ...profileData,
                      address: addressData
                    }
                  })

                  // 2. Gérer les professions si elles ont changé
                  if (allProfessions && professions && userData.role === "entreprise") {
                    const oldProfessions = userData.profile.professions || []
                    const newProfessions = professions

                    // Professions à ajouter
                    const toAdd = newProfessions.filter((p: string) => !oldProfessions.includes(p))
                    // Professions à retirer
                    const toRemove = oldProfessions.filter((p: string) => !newProfessions.includes(p))

                    // Convertir les noms en IDs
                    const professionIdsToAdd = toAdd
                      .map((name: string) => allProfessions.find(p => p.profession_name === name)?.id)
                      .filter((id: number | undefined): id is number => id !== undefined)

                    // Ajouter les nouvelles professions
                    if (professionIdsToAdd.length > 0) {
                      await addProfessions.mutateAsync({
                        profileId: userData.profile.id,
                        profession_ids: professionIdsToAdd
                      })
                    }

                    // Retirer les professions supprimées
                    for (const professionName of toRemove) {
                      const professionId = allProfessions.find(p => p.profession_name === professionName)?.id
                      if (professionId) {
                        await removeProfession.mutateAsync({
                          profileId: userData.profile.id,
                          professionId
                        })
                      }
                    }
                  }

                  handleSuccessfulUpdate()
                } catch (err: any) {
                  alert(`Erreur lors de la mise à jour : ${err.message}`)
                }
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default EditUserProfile
