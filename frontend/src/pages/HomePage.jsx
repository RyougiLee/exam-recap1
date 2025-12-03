import { useEffect, useState } from "react";
import JobListings from "../components/JobListings";

const Home = () => {
  const [products, setProducts] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("api/products");
        if (!res.ok) {
          throw new Error("could not fetch the data for that resource");
        }
        const data = await res.json();
        setIsPending(false);
        setProducts(data);
        setError(null);
      } catch (err) {
        setIsPending(false);
        setError(err.message);
      }
    };
    // setTimeout(() => {fetchJobs();}, 1000); // Delay of 1 second
    fetchProducts();
  }, []);

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {products && <JobListings products={products} />}
    </div>
  );
};

export default Home;
