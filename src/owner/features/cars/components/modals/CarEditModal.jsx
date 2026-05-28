import CarForm from "../CarForm";
import { useCarUpdate } from "../../hooks/useCarMutations";

const CarEditModal = ({ close, car }) => {
  const { mutate, isPending } = useCarUpdate();

  const handleSubmit = (state) => {
    if (!car?._id) return;
    mutate({ id: car._id, ...state }, { onSuccess: () => close() });
  };

  return (
    <CarForm
      car={car}
      isPending={isPending}
      submitLabel="Saqlash"
      onSubmit={handleSubmit}
      onCancel={() => close()}
    />
  );
};

export default CarEditModal;
