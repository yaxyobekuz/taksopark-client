import { useOutletContext } from "react-router-dom";
import { CashbackDriverPanel } from "@/owner/features/finance";

const DriverCashbackPage = () => {
  const { driver } = useOutletContext();
  return <CashbackDriverPanel driver={driver} />;
};

export default DriverCashbackPage;
