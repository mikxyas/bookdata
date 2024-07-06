
const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return new Response("Query parameter 'q' is required", { status: 400 });
  }

  try {
   
    const apiUrl = `http://openlibrary.org/search.json?title=${encodeURIComponent(query)}&fields=title,author_name,number_of_pages_median&limit=3`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }
    const data = await response.json();
    const books = data.docs.map((book: any) => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(", ") : "Unknown",
      pages: book.number_of_pages_median || "Unknown",
    }));
    return new Response(JSON.stringify(books), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Failed to fetch books", { status: 500 });
  }
};

Deno.serve(handler);
