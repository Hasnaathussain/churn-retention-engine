import { redirect } from "next/navigation";

export default function PlaybooksRedirectPage() {
  redirect("/app/campaigns?tab=playbooks");
}
