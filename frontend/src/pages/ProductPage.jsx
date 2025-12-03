import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const deleteJob = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete job: ${errorText}`);
      }
      console.log("Job deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const onDeleteClick = (jobId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?" + jobId
    );
    if (!confirm) return;

    deleteJob(jobId);
  };

  return (
    <div className="job-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{products.title}</h2>
          <p>category: {products.category}</p>
          <p>Description: {products.description}</p>
          <p>price: {products.price}</p>
          <p>stockQuantity: {products.stockQuantity}</p>
          <p>supplier name: {products.supplier.name}</p>
          <p>supplier contactEmail: {products.supplier.contactEmail}</p>
          <p>supplier contactPhone: {products.supplier.contactPhone}</p>
          <p>supplier rating: {products.supplier.rating}</p>

          {isAuthenticated && (
            <>
              <button onClick={() => onDeleteClick(products._id)}>delete</button>
              <button onClick={() => navigate(`/edit-job/${products._id}`)}>
                edit
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
