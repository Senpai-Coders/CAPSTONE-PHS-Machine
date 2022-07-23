// import { FiHardDrive } from "react-icons/fi";
import { FaEye } from "react-icons/fa";

const PastDetectionBlock = ({ pastDetection }) => {
  return (
    <div className="mb-2">
      <div className="shadow-lg rounded-2xl p-4 card bg-base-100 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="font-bold text-md">Past Detection</span>
            </div>
          </div>
          <span className="rounded-xl text-secondary text-sm relative p-2 ">
            <a href="/detections"> More </a>
          </span>
        </div>
        <ul className="overflow-y-scroll max-h-96 ">
          {pastDetection.map((det, idx) => (
            <li
              key={idx}
              className="flex items-center text-gray-400 justify-between py-3 border-b-2 border-gray-700"
            >
              <div className="flex items-center justify-start text-sm">
                <span className="mx-4">{idx + 1}</span>
                <img className="h-8 w-8" src={det.img_annotated} />
                <span className=""></span>
              </div>
              <div
                className="tooltip tooltip-left"
                data-tip="View Detection Info"
              >
                <a href={`/detection_details?_id=${det._id}`} target="blank">
                  <FaEye className="text-secondary w-4 h-4 mr-2" />
                </a>
              </div>
            </li>
          ))}
          {pastDetection.length === 0 && (
            <li>
              <p className="opacity-40 text-center my-2 text-sm">
                No Past Heatstress Detection
              </p>
            </li>
          )}
          {pastDetection.length === 10 && (
            <li className="text-center my-2">
              <a
                href="/detections"
                className="text-primary text-sm"
              >
                View More Records
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PastDetectionBlock;
