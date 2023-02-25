import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createServer } from "../../store/servers";
import { addSingleImage } from "../../store/aws_images";
import { useHistory } from "react-router-dom";
import nextIcon from "../../../assets/images/rightArrow.svg";
import backIcon from "../../../assets/images/leftArrow.svg";
import discordIcon from '../../../assets/images/discordIcon.svg'

const AddServerForm = ({setShowNewServerModal}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [serverName, setServerName] = useState("");
  const [serverNameErrors, setServerNameErrors] = useState([]);
  const [serverImage, setServerImage] = useState(null);
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState([]);


  useEffect(() => {
    setServerNameErrors([]);
  }, [serverName]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    let newImage;
    if (serverImage) {
      newImage = await dispatch(addSingleImage(serverImage));
    }
    try {
      const data = await dispatch(
        createServer({ serverName, imageId: newImage ? newImage.id : null })
      );
      history.push("/app");
      setShowNewServerModal(false);
    } catch (err) {
      console.log(err)
      const newErrors = await err.json();
      newErrors.errors.forEach((error) => {
        console.log(error);
      });
    }
  };

  const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) setServerImage(file);
  };

  const handleNextButton = () => {
    if (page === 0) {
      const errors = [];
      if (serverName.length < 3) errors.push("server name must be at least 3 characters");
      if (serverName.length > 20) errors.push("server name must be less than 20 characters");
      if (errors.length > 0) {
        setServerNameErrors(errors);
        return;
      }
    }
    setPage(page + 1);
  };


  const handleBackButton = () => {
    setPage(page - 1);
  };


  return (
    <div className="flex flex-col justify-between min-w-[25em] w-[25em] h-[15em] p-5">
      {page === 0 && (
        <div>
          <h1 className="w-full text-center text-2xl font-bold mb-3">
            Create a server
          </h1>
          <p className="text-center text-[.9rem] text-gray mb-7">
            Your server is where you and your friends hang out. Make yours and
            start talking.
          </p>
        </div>
      )}
      {serverNameErrors.length > 0 && (
        <div className="mb-2 -mt-4 text-center font-semibold">
          {serverNameErrors.map((err, i) => (
            <p className="text-lightRed capitalize" key={i}>
              {err}
            </p>
          ))}
        </div>
      )}
      <form className="flex flex-col h-full" onSubmit={handleSubmit}>
        {page === 0 && (
          <div className="flex justify-between border-2 border-[#cfcece] rounded-md h-10">
            <input
              placeholder="Server Name"
              className="px-2 w-full focus:outline-none rounded-md h-full"
              type="text"
              name="serverName"
              id="serverName"
              maxLength="20"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
            <div
              className={`flex items-center mr-4 text-${
                serverName.length > 20 ? "lightRed" : "lightGray"
              }`}
            >
              {serverName.length}
            </div>
          </div>
        )}
        {page === 1 && (
          <div>
            <label htmlFor="serverImage">Server Icon Image</label>
            <input type="file" name="serverImage" id="serverImage" />
          </div>
        )}
        {page === 2 && (
          <div className="flex flex-col w-full h-full justify-center items-center -mt-2">
            <div className="flex w-full justify-around items-center">
              <img className="max-w-[20%]" src={serverImage ? serverImage : discordIcon} alt="" />
              <span className="text-[2.3rem] -ml-5 text-lightGray">-</span>
              <div>
                <h3 className="uppercase mr-5 font-bold tracking-wide">{serverName}</h3>
              </div>
            </div>
            <button className="w-[90%] py-3 rounded-[2em] font-bold tracking-wider text-[1.3rem] bg-hero text-white mt-4 hover:bg-demoButtonHover transition-all duration-1000 hover:scale-105 active:scale-90" type="submit">
              Create Server
            </button>
          </div>
        )}
      </form>
      {[0, 1, 2].includes(page) && (
        <div className="flex w-full justify-between">
          {page === 0 && <div></div>}
          {page > 0 && (
            <button
              onClick={handleBackButton}
              className="flex items-center justify-center hover:text-lightGray cursor-pointer"
            >
              <img className="pr-2 inline" src={backIcon} alt="" />
              back
            </button>
          )}

          {page < 2 && (
            <button
              onClick={handleNextButton}
              className="flex items-center justify-center hover:text-lightGray cursor-pointer"
            >
              next
              <img className="pl-2 inline " src={nextIcon} alt="" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddServerForm;
