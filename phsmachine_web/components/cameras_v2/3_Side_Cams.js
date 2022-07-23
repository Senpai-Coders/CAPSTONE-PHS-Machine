import { Camera, Thermal, Annotated } from "./";

const cameras = ({ canStream }) => {
  return (
    <div className="mt-5 mb-8 gap-4 grid grid-cols-1 lg:grid-cols-3">
      <Camera canStream={canStream} />
      <Thermal canStream={canStream} />
      <Annotated canStream={canStream} />
    </div>
  );
};

export default cameras;
