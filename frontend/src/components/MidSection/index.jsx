import DirectMessagesList from "../DMSection"
import Channels from "../Channels"

const MidSection = ({serverClicked}) => {
  return (
    <div className='relative z-0 min-w-[18%] max-w-[18%] py-2 px-3 min-h-screen max-h-screen overflow-auto bg-midGray'>
      {serverClicked ? <Channels/> : <DirectMessagesList />}
    </div>
  )
}

export default MidSection
