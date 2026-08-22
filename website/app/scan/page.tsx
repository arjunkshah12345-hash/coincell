import { ScanApp } from "@/components/ScanApp";
import "../scan/scan.css";

export const metadata = {
  title: "Haloscan — Live X-ray Analysis",
  description: "Upload pediatric X-rays for real-time battery vs coin classification.",
};

export default function ScanPage() {
  return <ScanApp />;
}
