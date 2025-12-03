import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
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

  const addJob = async (newProduct) => {
    try {
      console.log("Adding job:", newProduct);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) {
        throw new Error("Failed to add job");
      }
      return true;
    } catch (error) {
      console.error("Error adding job:", error);
      return false;
    }
  };

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

    const success = await addJob(newProduct);
    if (success) {
      console.log("Job Added Successfully");
      navigate("/");
    } else {
      console.error("Failed to add the job");
    }
  };

  return (
    <div className="create">
      <h2>Add a New Product</h2>
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
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
