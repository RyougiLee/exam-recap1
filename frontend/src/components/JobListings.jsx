import { Link } from "react-router-dom";

const JobListings = ({ products }) => {
  return (
    <div className="job-list">
      {products.map((products) => (

        <div className="job-preview" key={products.id}>
          <Link to={`/jobs/${products.id}`}>
            <h2>{products.title}</h2>
          </Link>
          <p>Type: {products.category}</p>
          <p>price: {products.price}</p>
        </div>
      ))}
    </div>
  );
};

export default JobListings;
