import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import { useParams } from "react-router";
import { getOneGift } from "../services/giftAPI";
import AgeGroup from "../features/confirmGift/AgeGroup";
import GiftUserList from "../features/confirmGift/GiftUserList";

function ConfirmGift() {
  const { id } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["gift", id],
    queryFn: () => getOneGift(id!),
    enabled: !!id,
  });

  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      {!id || isPending ? <p>...</p> : <AgeGroup gift={data.data} />}
      <GiftUserList />
    </div>
  );
}

export default ConfirmGift;
