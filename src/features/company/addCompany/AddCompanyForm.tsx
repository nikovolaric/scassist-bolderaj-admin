import { useFormStatus } from "react-dom";
import { createCompany } from "../../../services/companiesAPI";
import { useNavigate } from "react-router";

function AddCompanyForm() {
  const navigate = useNavigate();

  async function handleFormAction(formData: FormData) {
    const companyData = Object.fromEntries(formData);

    const { data } = await createCompany(companyData);

    navigate(`/dashboard/companies/${data.id}`);
  }

  return (
    <div className="flex flex-col gap-16">
      <p className="text-3xl font-semibold">Ustvari podjetje</p>
      <form
        className="grid grid-cols-[4fr_1fr] gap-x-5 gap-y-16"
        action={handleFormAction}
      >
        <div>
          <p>Podatki podjetja</p>
          <div className="flex flex-col gap-10 rounded-xl bg-white p-8">
            <div>
              <p className="text-sm font-medium">
                Ime podjetja <span className="text-secondary">*</span>
              </p>
              <input
                placeholder="Vnesite ime podjetja"
                className="w-80 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
                name="companyName"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                Davčna številka <span className="text-secondary">*</span>
              </p>
              <input
                placeholder="Vnesite davčno številko"
                className="w-80 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
                name="companyTaxNo"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                Sedež podjetja <span className="text-secondary">*</span>
              </p>
              <div className="flex items-center justify-between gap-5">
                <input
                  placeholder="Vnesite naslov ulice"
                  className="w-80 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
                  name="companyAddress"
                  autoComplete="off"
                  required
                />
                <input
                  placeholder="Vnesite mesto"
                  className="w-80 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
                  name="companyCity"
                  autoComplete="off"
                  required
                />
                <input
                  placeholder="Vnesite poštno številko"
                  className="rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
                  name="companyPostalCode"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <p>Kontaktni podatki</p>
          <div className="flex flex-col gap-10 rounded-xl bg-white p-8">
            <div>
              <p className="text-sm font-medium">
                Kontaktna oseba <span className="text-secondary">*</span>
              </p>
              <input
                placeholder="Vnesite kontaktno osebo"
                className="w-80 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
                name="contactPerson"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                Telefonska številka <span className="text-secondary">*</span>
              </p>
              <input
                placeholder="Vnesite telefonsko številko"
                className="w-80 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
                name="companyPhone"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                Elektronski naslov <span className="text-secondary">*</span>
              </p>
              <div className="flex items-center justify-between">
                <input
                  placeholder="Vnesite elektronski naslov"
                  className="w-80 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
                  name="companyEmail"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <p>Opombe</p>
          <div className="flex flex-col gap-10 rounded-xl bg-white p-8">
            <textarea
              placeholder="Vnesite morebitne opombe"
              className="h-24 w-full outline-none"
              name="additionalInfo"
              autoComplete="off"
            />
          </div>
        </div>
        <Button />
      </form>
    </div>
  );
}

function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      className="from-primary to-secondary drop-shadow-btn hover:to-primary col-span-2 cursor-pointer justify-self-end rounded-lg bg-gradient-to-r px-8 py-2 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
      disabled={pending}
    >
      {pending ? "..." : "Shrani in ustvari podjetje"}
    </button>
  );
}

export default AddCompanyForm;
