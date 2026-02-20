import type { Address } from "./address.type"
import type { Task } from "./task.type"
import type { CustomerProfile, EntrepriseProfile } from "./user.type"

type ProjectUser = {
  id: number
  email: string
  profiles: (CustomerProfile | EntrepriseProfile)[]
}

export type Project = {
  id: number
  title: string
  description: string
  start_date: string
  end_date?: string
  address_id  :   number
  customer_id  : number
  entreprise_id : number | null
  is_finished: boolean
 // Relations optionnelles si le backend les inclut
  address?: Address
  tasks?: Task[]
  customer?: ProjectUser
  entreprise?: ProjectUser
}
