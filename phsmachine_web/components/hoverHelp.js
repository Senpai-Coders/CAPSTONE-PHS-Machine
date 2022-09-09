import { IoMdHelpCircle } from "react-icons/io";

const hoverHelp = ({ tooltipText }) => {
  return (
    <div className="tooltip" data-tip={tooltipText}>
      <IoMdHelpCircle className="h-6 w-6" />
    </div>
  );
};

export default hoverHelp;
