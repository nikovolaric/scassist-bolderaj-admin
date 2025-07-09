import Header from "../components/Header";
import SearchGifts from "../features/gifts/SearchGifts";

function Gifts() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <SearchGifts />
    </div>
  );
}

export default Gifts;
