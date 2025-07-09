import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useParams } from "react-router";
import { confirmGift } from "../../services/giftAPI";

function GiftUserListCard({
  user,
  i,
}: {
  user: {
    fullName: string;
    birthDate: string;
    email: string;
    _id: string;
    ageGroup: string[];
  };
  i: number;
}) {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const data = queryClient.getQueryData<{
    data: { article: { name: { sl: string }; ageGroup: string[] } };
  }>(["gift", id]);

  return (
    <div
      className={`border-gray/75 relative grid grid-cols-3 items-center justify-items-start border-b px-3 py-4 ${i % 2 === 0 ? "bg-primary/10" : ""}`}
    >
      <div>
        <p className="font-medium">{user.fullName}</p>
        <p className="text-black/50">
          {new Date(user.birthDate).toLocaleDateString("sl-SI", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>
      <p className="text-black/50">{user.email}</p>
      {data &&
        user.ageGroup.some((el) => data.data.article.ageGroup.includes(el)) &&
        (isSuccess ? (
          <p className="font-semibold">Darilni bon je bil vnovčen.</p>
        ) : (
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer rounded-lg bg-gradient-to-r px-20 py-2 font-semibold transition-colors duration-300"
            onClick={() => setIsOpenConfirm(true)}
          >
            Vnovči {data && data.data.article.name.sl}
          </button>
        ))}
      {isOpenConfirm && (
        <ConfirmUseGift
          setIsOpenConfirm={setIsOpenConfirm}
          setIsSuccess={setIsSuccess}
          userId={user._id}
        />
      )}
    </div>
  );
}

function ConfirmUseGift({
  setIsOpenConfirm,
  setIsSuccess,
  userId,
}: {
  setIsOpenConfirm: Dispatch<SetStateAction<boolean>>;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  userId: string;
}) {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  async function handleUseTicket() {
    try {
      setIsLoading(true);

      const data = await confirmGift(id!, userId);

      if (data instanceof Error) {
        alert("Bon ni veljaven!");
        throw new Error(data.message);
      }

      setIsSuccess(true);

      setIsOpenConfirm(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`bg-neutral/95 border-gray/80 absolute top-0 right-0 z-50 flex w-93 flex-col gap-15 rounded-xl border px-6 pt-16 pb-5.5`}
    >
      <p className="font-medium">
        Ali ste prepričani, da želite uporabniku vnovčiti darilni bon?
      </p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpenConfirm(false)}
          className="flex cursor-pointer items-center gap-4 rounded-xl border border-black px-4 py-3 font-semibold"
        >
          <ChevronLeftIcon className="h-4 stroke-3" /> Prekliči
        </button>
        <button
          onClick={handleUseTicket}
          className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          disabled={isLoading}
        >
          Da, vnovči bon <ChevronRightIcon className="h-4 stroke-3" />
        </button>
      </div>
    </div>
  );
}

export default GiftUserListCard;
