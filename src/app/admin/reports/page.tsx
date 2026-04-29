import dynamic from "next/dynamic";

const AdminReports = dynamic(() => import("@/src/components/Admin/AdminReportsPage"), {
  ssr: false,
});

export default function Page() {
  return <AdminReports />;
}
