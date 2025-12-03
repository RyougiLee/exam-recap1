import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const name = useField("text");  
  const email = useField("email");
  const password = useField("password");
  const role = useField("text");
  const address = useField("text");


  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      email: email.value,
      password: password.value,
      name: name.value,
      role: role.value,
      address: address.value,
    });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} />
        <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />
        <label>role:</label>
        <select {...role}>
          <option value="">select a option</option>
          <option value="Admin">Admin</option>
          <option value="Seller">Seller</option>
          <option value="Buyer">Buyer</option>
        </select>
        <label>address:</label>
        <input {...address} />
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
