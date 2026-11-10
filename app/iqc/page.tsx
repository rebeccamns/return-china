import { redirect } from "next/navigation";
import { DEMO } from "@/lib/demo-data";

export default function IQCPage() {
  redirect(`/iqc/${DEMO.moNumber}`);
}