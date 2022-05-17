
import {  Camera, Thermal } from "./cameras/"

const cameras = () => {

  return (
    <div className="mt-5 mb-8 gap-4 grid grid-cols-1 sm:grid-cols-2">
        <Camera />
        <Thermal />
    </div>
  );
};

export default cameras;
