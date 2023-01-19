import { logout } from "../store/session";
import { useDispatch } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(logout())}>
      Log Out
    </button>
  );
}

export default Logout;
