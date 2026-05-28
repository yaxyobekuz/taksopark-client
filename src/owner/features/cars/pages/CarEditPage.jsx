import { useNavigate, useOutletContext } from "react-router-dom";
import DetailSection from "@/shared/components/ui/layout/DetailSection";
import CarForm from "../components/CarForm";
import { useCarUpdate } from "../hooks/useCarMutations";

const CarEditPage = () => {
  const { car } = useOutletContext();
  const navigate = useNavigate();
  const { mutate, isPending } = useCarUpdate();

  const handleSubmit = (state) => {
    if (!car?._id) return;
    mutate(
      { id: car._id, ...state },
      { onSuccess: () => navigate(`/owner/cars/${car._id}`) },
    );
  };

  return (
    <DetailSection title="Mashinani tahrirlash" defaultOpen collapsible={false}>
      <div className="max-w-xl">
        <CarForm
          car={car}
          isPending={isPending}
          submitLabel="Saqlash"
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/owner/cars/${car._id}`)}
        />
      </div>
    </DetailSection>
  );
};

export default CarEditPage;
