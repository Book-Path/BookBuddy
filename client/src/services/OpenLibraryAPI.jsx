const searchBooks = async (title) => {
    const params = new URLSearchParams({
        title,
        fields: "key,title,author_name,number_of_pages_median,cover_i,first_publish_year",
        limit: 20,
    });

    const res = await fetch(`https://openlibrary.org/search.json?${params}`);

    if (!res.ok) throw new Error("Search failed");

    const data = await res.json();

    return data.docs;
}


export default { searchBooks };

