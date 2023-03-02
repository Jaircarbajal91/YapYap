import { useHistory } from "react-router-dom";
import yapyap from "../../../assets/images/yapyap.svg";
import yapyapLogo from '../../../assets/images/yapyapLogo.svg'
import './Navbar.css'

const Navbar = () => {
  const history = useHistory();
  return (
    <nav className="nav-container">
      <div className="flex gap-1 cursor-pointer items-center navbar-brand" onClick={() => history.push('/')}>
        <img className="w-[4em]" src={yapyap} alt="" />
        <img className="w-[4em]" src={yapyapLogo} alt="" />
      </div>
      <button onClick={() => history.push("/login")}
      className="bg-white tracking-wider text-black w-fit p-2 px-4 max-h-[3em] rounded-full hover:text-hero transition delay-75">Login</button>
    </nav>
  );
};

export default Navbar;
