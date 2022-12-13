// import { FiHardDrive } from "react-icons/fi";
import { useRouter } from "next/router";
import { FaEye } from "react-icons/fa";
import { appendToFSUrl, dateMomentBeautify, getDateAgo } from "../../helpers/"

const PastDetectionBlock = ({ pastDetection }) => {
  const router = useRouter();
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
              onClick={()=>{router.push(`/detection_details?_id=${det._id}`)}}
              className="flex items-center cursor-pointer duration-150 ease-in-out justify-between py-3 border-b-2 border-gray-700 hover:bg-base-300 "
            >
              <div className="flex items-center justify-start text-sm">
                {/* <span className="mx-4">{idx + 1}</span> */}
                <img className="h-8 w-8" src={appendToFSUrl(det.img_annotated)} />
              </div>
              <div className="">
                  <p className="text-sm">{dateMomentBeautify(det.cat, "MMM Do YYYY, h:mm a")}</p>
                  <p className="text-xs">({getDateAgo(new Date(), new Date(det.cat))} days ago)</p>
              </div>
              <div
                className="tooltip tooltip-left"
                data-tip="View Detection Info"
              >
                <a>
                  <FaEye className="text-secondary w-4 h-4 mr-2 cursor-pointer" />
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
              onClick={() => router.push("/detections")}
                className="text-primary text-sm cursor-pointer"
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
