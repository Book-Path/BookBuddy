import { API_URL } from "../config";
 

//HTTP request: GET /api/books/{id}

const BOOKS_URL = `${API_URL}/api/books`;


const request = async (url, options = {}) => {
    
    const res = await fetch(url, {
        headers: { 'Content-type': "application/json" },
        credentials: "include",
        ...options
    })
    
    if (res.status === 401) {
        window.location.href = "/";
        throw new Error("Your session expired. Please log in again.");
    }
    
    const data = await res.json()
    
    if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.')
    }
    
    return data
}

// const getBooks = async (id) => request(`${API_URL}/${id}`)
const getMyBooks = async () => request(BOOKS_URL);
const createBook = async (book) => request(BOOKS_URL, {
    method: "POST",
    body: JSON.stringify(book),
});

const editBook = async (id, book) => request(`${BOOKS_URL}/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify(book),
});

const deleteBook = async (id) => request(`${BOOKS_URL}/${id}`, {
    method: "DELETE",
})


const getMyAchievements = async () => request(`${API_URL}/api/achievements`);

export default { getMyBooks, createBook, editBook, deleteBook, getMyAchievements };