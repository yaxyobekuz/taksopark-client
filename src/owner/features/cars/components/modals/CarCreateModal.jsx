import CarForm from "../CarForm";
import { useCarCreate } from "../../hooks/useCarMutations";

const CarCreateModal = ({ close }) => {
  const { mutate, isPending } = useCarCreate();

  const handleSubmit = (state) => {
    mutate(state, { onSuccess: () => close() });
  };

  return (
    <CarForm
      isPending={isPending}
      submitLabel="Saqlash"
      onSubmit={handleSubmit}
      onCancel={() => close()}
    />
  );
};

export default CarCreateModal;
