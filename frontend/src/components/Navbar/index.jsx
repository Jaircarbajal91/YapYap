import { useHistory } from "react-router-dom";
import './Navbar.css'

const Navbar = () => {
  const history = useHistory();
  return (
    <nav className="nav-container">
      <div className="navbar-brand" to="/">
        <img src="" alt="" />
        logo
      </div>
      <button onClick={() => history.push("/login")}
      className="bg-white tracking-wider text-black w-fit p-2 px-4 rounded-full hover:text-hero transition delay-75">Login</button>
    </nav>
  );
};

export default Navbar;
