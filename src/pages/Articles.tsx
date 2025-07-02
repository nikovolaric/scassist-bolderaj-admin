import Header from "../components/Header";
import SearchArticles from "../features/Articles/SearchArticles";

function Articles() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <SearchArticles />
    </div>
  );
}

export default Articles;
