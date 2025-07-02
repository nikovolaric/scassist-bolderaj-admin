import { useQuery } from "@tanstack/react-query";
import { getUserChildren } from "../../services/userAPI";
import { useParams } from "react-router";
import Spinner from "../../components/Spinner";
import LinkBtn from "../../components/LinkBtn";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

function UserChildren() {
  const { id } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["children", id],
    queryFn: () => getUserChildren(id!),
    enabled: !!id,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (data.results > 0) {
    return (
      <div>
        <p className="text-sm font-medium">Mladoletne osebe</p>
        <div>
          {data.children.map(
            ({
              child,
            }: {
              child: { fullName: string; _id: string; birthDate: string };
            }) => (
              <ChildCard key={child._id} child={child} />
            ),
          )}
        </div>
      </div>
    );
  }
}

function ChildCard({
  child,
}: {
  child: { fullName: string; _id: string; birthDate: string };
}) {
  const { fullName, _id, birthDate } = child;

  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-6 py-7">
      <div className="flex items-center gap-11">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.08">
            <g clipPath="url(#clip0_4188_4028)">
              <circle cx="20" cy="20" r="19" stroke="black" stroke-width="2" />
              <path
                d="M30.8333 31.6673C30.8333 29.8583 30.8333 28.9537 30.6091 28.2177C30.1041 26.5605 28.8015 25.2637 27.1369 24.761C26.3976 24.5377 25.489 24.5377 23.6719 24.5377H17.1615C15.3443 24.5377 14.4357 24.5377 13.6964 24.761C12.0318 25.2637 10.7292 26.5605 10.2243 28.2177C10 28.9537 10 29.8583 10 31.6673M26.276 14.1673C26.276 17.389 23.6527 20.0007 20.4167 20.0007C17.1806 20.0007 14.5573 17.389 14.5573 14.1673C14.5573 10.9457 17.1806 8.33398 20.4167 8.33398C23.6527 8.33398 26.276 10.9457 26.276 14.1673Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <rect
              x="0.375"
              y="0.375"
              width="39.25"
              height="39.25"
              rx="19.625"
              stroke="black"
              strokeWidth="0.75"
            />
          </g>
          <defs>
            <clipPath id="clip0_4188_4028">
              <rect width="40" height="40" rx="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <p className="text-lg font-medium">{fullName}</p>
      </div>
      <p className="text-black/75">
        {new Date(birthDate).toLocaleDateString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>
      <LinkBtn type="primary" to={`/dashboard/users/${_id}`}>
        <ChevronRightIcon className="h-5 stroke-2" />
      </LinkBtn>
    </div>
  );
}

export default UserChildren;
