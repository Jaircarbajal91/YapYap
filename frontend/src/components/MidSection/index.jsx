import DirectMessagesList from "../DirectMessages"
import Channels from "../Channels"
import { useSelector, useDispatch } from "react-redux"
import { getDirectMessages } from "../../store/directMessages"
import { useEffect, useState } from "react"



const MidSection = ({serverClicked}) => {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  const directMessages = Object.values(useSelector(state => state.dms))

  useEffect(() => {
    dispatch(getDirectMessages()).then(() => setIsLoaded(true))
  }, [dispatch])

  return isLoaded && (
    <div className='relative z-0 min-w-[18em] w-[18em] max-w-[18em] py-2 px-3 min-h-screen max-h-screen overflow-auto bg-midGray'>
      {serverClicked ? <Channels /> : <DirectMessagesList directMessages={directMessages}/>}
    </div>
  )
}

export default MidSection
