import { useOutletContext, useParams } from "react-router-dom";
import PaymentsMonthView from "../components/PaymentsMonthView";

const DriverPaymentsPage = () => {
  const { id } = useParams();
  const { driver } = useOutletContext();
  return <PaymentsMonthView driverId={id} driver={driver} />;
};

export default DriverPaymentsPage;
