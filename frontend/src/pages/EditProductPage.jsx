import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProductPage = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();

  // Declare state variables for form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [rating, setRating] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const navigate = useNavigate();

  const updateProduct = async (product) => {
    try {
      console.log("Updating product:", product);
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to update job");
      return res.ok;
    } catch (error) {
      console.error("Error updating job:", error);
      return false;
    }
  };

  // Fetch job data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setProducts(data); // Set the job data

        // Initialize form fields with fetched job data
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setPrice(data.price);
        setStockQuantity(data.stockQuantity);
        setSupplierName(data.supplier.name);
        setContactEmail(data.supplier.contactEmail);
        setContactPhone(data.supplier.contactPhone);
        setRating(data.supplier.rating);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchProduct();
  }, [id]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const newProduct = {
      title,
      category,
      description,
      price,
      stockQuantity,
      supplier: {
        name: supplierName,
        contactEmail,
        contactPhone,
        rating
      },
    };

    const success = await updateProduct(newProduct);
    if (success) {
      console.log("Job Updated Successfully");
      navigate(`/jobs/${id}`);
    } else {
      console.error("Failed to update the job");
    }
  };

  return (
    <div className="create">
      <h2>Update Job</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
          <form onSubmit={submitForm}>
            <label>Product title:</label>
            <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <label>Product Category:</label>
            <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            ></input>

            <label>Product Description:</label>
            <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <label>Price:</label>
            <textarea
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            ></textarea>

            <label>stockQuantity:</label>
            <textarea
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
            ></textarea>

            <label>Supplier name:</label>
            <input
                type="text"
                required
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
            />
            <label>Contact Email:</label>
            <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
            />
            <label>Contact Phone:</label>
            <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
            />
            <label>rating:</label>
            <input
                type="tel"
                required
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            <button type="submit">update Product</button>
          </form>
      )}
    </div>
  );
};

export default EditProductPage;
