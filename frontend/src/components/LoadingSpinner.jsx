import Lottie from "lottie-react";
import loadingAnimation from "../assets/Loading.json"; 

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-opacity-50">
      <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150, height: 150 }} />
    </div>
  );
};

export default LoadingSpinner;
