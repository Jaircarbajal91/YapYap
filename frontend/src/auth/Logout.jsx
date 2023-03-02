import { logout } from "../store/session";
import { useDispatch } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();
  return (
    <button className="cursor-pointer w-[50%] border-2 p-2 text-lightGray text-start " onClick={() => dispatch(logout())}>
      Log Out
    </button>
  );
}

export default Logout;
