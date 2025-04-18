import { useEffect, useState } from "react";
import "./Headlines.css";
import axios from "axios";

function Headlines() {
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "law",
            sortBy: "publishedAt",
            pageSize: 5,
            apiKey: "3b058bd8af81404bbc2c32e60d145351",  // Replace with your actual API key
          },
        });
        console.log("News API Response:", response.data); // Log API response
        setHeadlines(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Error fetching news. Please try again later.");
        setHeadlines([]);
      }
    };

    fetchNews(); // Initial fetch

    const interval = setInterval(fetchNews, 1800000); // Fetch every 30 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="headlines">
      <h2>Latest News</h2>
      {error ? (
        <p>{error}</p> // Show error message if there is an error
      ) : (
        <ul>
          {Array.isArray(headlines) && headlines.length > 0 ? (
            headlines.map((article, index) => (
              <li key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </li>
            ))
          ) : (
            <li>No headlines available</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default Headlines;
