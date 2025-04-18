
import { useEffect, useState } from "react";
import "./Headlines.css" ;
import axios from "axios";

function Headlines() {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "law",
            sortBy: "publishedAt",
            pageSize: 5,
            apiKey: "3b058bd8af81404bbc2c32e60d145351",
          },
        });
        setHeadlines(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
  
    fetchNews(); // Initial fetch
  
    const interval = setInterval(fetchNews, 1800000 ); // Fetch every 30 minutes
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  return (
    <div className="headlines">
      <h2>Latest News</h2>
      <ul>
        {headlines.map((article, index) => (
          <li key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Headlines;
