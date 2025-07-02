import { PencilIcon } from "@heroicons/react/24/outline";
import UserList from "./UserList";
import Visits from "./Visits";
import { useState } from "react";
import { updateCompany } from "../../services/companiesAPI";
import { useQueryClient } from "@tanstack/react-query";
import CompanyVisits from "./CompanyVisits";
import AdditionalInfo from "./AdditionalInfo";

function CompanyInfo({
  company,
}: {
  company: {
    companyName: string;
    companySeat: string;
    companyTaxNo: string;
    companyPhone: string;
    companyEmail: string;
    contactPerson: string;
    unusedTickets: string[];
    _id: string;
    users: {
      fullName: string;
      birthDate: string;
      _id: string;
      email: string;
    }[];
  };
}) {
  const { users, unusedTickets } = company;

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-x-5 gap-y-18">
      <CompanyBasicInfo company={company} />
      <div className="flex flex-col gap-10">
        <UserList users={users} />
      </div>
      <div className="flex flex-col gap-10">
        <Visits visitsLeft={unusedTickets.length} id={company._id} />
        <div>
          <p className="text-sm font-medium text-black/75">
            Število aktivnih uporabnikov
          </p>
          <p className="rounded-lg bg-white px-5 py-3 text-3xl font-semibold">
            {users.length}
          </p>
        </div>
      </div>
      <CompanyVisits />
      <AdditionalInfo />
    </div>
  );
}

function CompanyBasicInfo({
  company,
}: {
  company: {
    companyName: string;
    companySeat: string;
    companyTaxNo: string;
    companyPhone: string;
    companyEmail: string;
    contactPerson: string;
    _id: string;
  };
}) {
  const queryClient = useQueryClient();

  const {
    companyName,
    companySeat,
    companyTaxNo,
    companyPhone,
    companyEmail,
    contactPerson,
    _id,
  } = company;

  const [editPerson, setEditPerson] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editMail, setEditMail] = useState(false);
  const [phone, setPhone] = useState(companyPhone);
  const [person, setPerson] = useState(contactPerson);
  const [mail, setMail] = useState(companyEmail);

  async function handleClick(newData: unknown) {
    try {
      await updateCompany(_id, newData);

      queryClient.invalidateQueries({ queryKey: ["company", _id] });

      setEditMail(false);
      setEditPerson(false);
      setEditPhone(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="col-span-2 grid grid-cols-3 gap-x-5 gap-y-10">
      <div>
        <p className="text-sm font-medium text-black/75">Ime podjetja</p>
        <p className="rounded-lg bg-white px-5 py-3 font-semibold">
          {companyName}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-black/75">Sedež podjetja</p>
        <p className="rounded-lg bg-white px-5 py-3 font-semibold">
          {companySeat}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-black/75">Davčna številka</p>
        <p className="rounded-lg bg-white px-5 py-3 font-semibold">
          {companyTaxNo}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-black/75">Kontaktna oseba</p>
        <p className="flex items-center justify-between rounded-lg bg-white px-5 py-3 font-semibold">
          <input
            defaultValue={contactPerson}
            className="outline-none"
            disabled={!editPerson}
            onChange={(e) => setPerson(e.target.value)}
          />
          {!editPerson && (
            <PencilIcon
              className="h-4 cursor-pointer stroke-2 text-black/50"
              onClick={() => setEditPerson(true)}
            />
          )}
          {editPerson && (
            <button
              className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer self-end rounded-lg bg-gradient-to-r px-8 py-1 text-sm font-semibold transition-colors duration-300"
              onClick={() => handleClick({ contactPerson: person })}
            >
              Shrani
            </button>
          )}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-black/75">Telefonska številka</p>
        <p className="flex items-center justify-between rounded-lg bg-white px-5 py-3 font-semibold">
          <input
            defaultValue={companyPhone}
            className="outline-none"
            disabled={!editPhone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {!editPhone && (
            <PencilIcon
              className="h-4 cursor-pointer stroke-2 text-black/50"
              onClick={() => setEditPhone(true)}
            />
          )}
          {editPhone && (
            <button
              className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer self-end rounded-lg bg-gradient-to-r px-8 py-1 text-sm font-semibold transition-colors duration-300"
              onClick={() => handleClick({ companyPhone: phone })}
            >
              Shrani
            </button>
          )}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-black/75">Elektronski naslov</p>
        <p className="flex items-center justify-between rounded-lg bg-white px-5 py-3 font-semibold">
          <input
            defaultValue={companyEmail}
            className="outline-none"
            disabled={!editMail}
            onChange={(e) => setMail(e.target.value)}
          />
          {!editMail && (
            <PencilIcon
              className="h-4 cursor-pointer stroke-2 text-black/50"
              onClick={() => setEditMail(true)}
            />
          )}
          {editMail && (
            <button
              className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer self-end rounded-lg bg-gradient-to-r px-8 py-1 text-sm font-semibold transition-colors duration-300"
              onClick={() => handleClick({ companyEmail: mail })}
            >
              Shrani
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

export default CompanyInfo;
