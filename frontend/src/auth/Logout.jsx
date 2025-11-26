import { logout } from "../store/session";
import { useDispatch } from "react-redux";
import signout from '../../assets/images/signout.svg'

const Logout = () => {
  const dispatch = useDispatch();
  return (
    <button 
      className="flex items-center justify-end gap-2 cursor-pointer p-2 text-white text-start hover:text-lightGray text-xs font-medium transition-colors active:scale-95 touch-manipulation sm:gap-3 sm:text-sm" 
      onClick={() => dispatch(logout())}
    >
      <img className="w-4 h-4 sm:max-w-[1.5em]" src={signout} alt="" />
      <span className="hidden sm:inline">Log out</span>
      <span className="sm:hidden">Out</span>
    </button>
  );
}

export default Logout;
