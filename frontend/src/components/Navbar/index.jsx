import { useHistory } from "react-router-dom";

const Navbar = () => {
  const history = useHistory();
  return (
    <nav className="absolute flex flex-row justify-around top-0 w-full z-100 pt-4">
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
