import ExtractedInfoPage from "../components/ExtractedInfoPage";
import InternalAccessGuard from "../components/InternalAccessGuard";

export default function Page() {
  return (
    <InternalAccessGuard>
      <ExtractedInfoPage />
    </InternalAccessGuard>
  );
}