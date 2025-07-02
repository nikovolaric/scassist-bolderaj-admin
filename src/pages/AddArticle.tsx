import Header from "../components/Header";
import AddArticleForm from "../features/Articles/AddArticleForm";

function AddArticle() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <AddArticleForm />
    </div>
  );
}

export default AddArticle;
