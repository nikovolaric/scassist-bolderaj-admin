import Header from "../components/Header";
import EditArticleForm from "../features/articles/EditArticleForm";

function EditArticle() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <EditArticleForm />
    </div>
  );
}

export default EditArticle;
