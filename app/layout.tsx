import type { Metadata } from "next";
import "./globals.css";
import { GovernanceProvider } from "@/context/GovernanceContext";
import { AuthProvider } from "@/components/AuthProvider";
import { RejectionModal } from "@/components/RejectionModal";

export const metadata: Metadata = {
  title: "Soptosur Governance OS | Soptosur Chain of Command",
  description:
    "Enterprise University Club Management ERP operating under North South University (NSU) Office of Student Affairs (OSA) regulations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <GovernanceProvider>
            {children}
            <RejectionModal />
          </GovernanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
