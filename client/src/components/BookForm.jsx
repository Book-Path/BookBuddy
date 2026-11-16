import { useState } from "react";
import '../pages/AddBookPage.css';
import '../pages/HomePage.css';

const toFormValues = (book) => ({
  title: book?.title ?? "",
  author: book?.author ?? "",
  genre: book?.genre ?? "",
  year: book?.year ?? "",
  pageCount: book?.page_count ?? "",
  currentPage: book?.current_page ?? "",
  coverImage: book?.cover_image ?? "",
  status: book?.status ?? "UNREAD",
});

const BookForm = ({ initialValues, onSubmit, onSuccess, onCancel, submitLabel = "Save" }) => {
  const [form, setForm] = useState(toFormValues(initialValues));
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saved = await onSubmit({
        ...form,
        year: form.year ? Number(form.year) : null,
        pageCount: form.pageCount ? Number(form.pageCount) : null,
        currentPage: form.currentPage ? Number(form.currentPage) : null,
        coverImage: form.coverImage || null,
      });
      setError(null);
      onSuccess(saved);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-body">
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="author">Author</label>
          <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="genre">Genre</label>
          <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="year">Year</label>
          <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="pageCount">Page Count</label>
          <input name="pageCount" type="number" placeholder="Page count" value={form.pageCount} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="currentPage">Current Page</label>
          <input name="currentPage" type="number" placeholder="Current page" value={form.currentPage} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="coverImage">Cover Image URL</label>
          <input name="coverImage" placeholder="Cover image URL" value={form.coverImage} onChange={handleChange} />
        </div>
      </div>

      {
        initialValues && (
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="UNREAD">Unread</option>
            <option value="READING">Reading</option>
            <option value="FINISHED">Finished</option>
          </select>
        )
      }

      <div className="form-buttons">
        <button className="add-book-btn" type="submit">Add Book</button>
        {onCancel && <button className="cancel-btn" type="button" onClick={onCancel}>Cancel</button>}
      </div>

      {error && <p>{error}</p>}
    </form >
  );
};

export default BookForm;