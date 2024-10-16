import { getSession } from "@/lib/session"
import { getUserLastUpdated } from "@/actions/server"
import ProfileHandler from "@/components/profile/ProfileHandler"

export default async function Profile() {
  const session = await getSession()
  const userLastUpdated = await getUserLastUpdated()
  if (!session) return
  return <ProfileHandler session={session} updated={userLastUpdated} />
}
