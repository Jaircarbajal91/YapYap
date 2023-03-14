import { logout } from "../store/session";
import { useDispatch } from "react-redux";
import signout from '../../assets/images/signout.svg'

const Logout = () => {
  const dispatch = useDispatch();
  return (
    <button className="flex items-center justify-end gap-3 cursor-pointer w-[50%] p-2 text-white text-start hover:text-lightGray text-sm font-medium" onClick={() => dispatch(logout())}>
      <img className="max-w-[1.5em]" src={signout} alt="" />
      Log out
    </button>
  );
}

export default Logout;
