import ChatHistoryPage from "../components/ChatHistoryPage";
import InternalAccessGuard from "../components/InternalAccessGuard";

export default function Page() {
  return (
    <InternalAccessGuard>
      <ChatHistoryPage />
    </InternalAccessGuard>
  );
}