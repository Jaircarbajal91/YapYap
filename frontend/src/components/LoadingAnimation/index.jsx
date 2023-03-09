import yapyap from '../../../assets/images/yapyap.svg'
import './LoadingAnimation.css'


const LoadingAnimation = () => {

  return (
    <div className="w-full h-screen bg-demoButton flex justify-center items-center">
      <div className="animate-bounce">
        <img className='w-[15em]' src={yapyap} alt="" />
      </div>
    </div>
  );
}

export default LoadingAnimation;
