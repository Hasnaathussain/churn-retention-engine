import { redirect } from "next/navigation";

export default async function LegacyAccountDetailRedirect({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  redirect(`/app/customers/${accountId}`);
}
