import { useNavigate } from "react-router-dom";
import CarForm from "../CarForm";
import { useCarCreate } from "../../hooks/useCarMutations";

const CarCreateModal = ({ close }) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCarCreate();

  const handleSubmit = (state) => {
    mutate(state, {
      onSuccess: (car) => {
        close();
        if (car?._id) navigate(`/owner/cars/${car._id}`);
      },
    });
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
