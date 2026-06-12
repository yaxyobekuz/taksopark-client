import { useOutletContext } from "react-router-dom";
import { DepositDriverPanel } from "@/owner/features/finance";

const DriverDepositPage = () => {
  const { driver } = useOutletContext();
  return <DepositDriverPanel driver={driver} />;
};

export default DriverDepositPage;
