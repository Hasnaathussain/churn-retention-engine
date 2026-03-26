import { redirect } from "next/navigation";

export default function DocsRedirectPage() {
  redirect("/product#setup");
}
