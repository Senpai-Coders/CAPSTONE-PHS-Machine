import React from "react";
import { GiMedicalThermometer } from "react-icons/gi";
import { tempParser } from "../../helpers"

const ThermalReadingBlock = ({ SYSSTATE }) => {
  return (
    <div className="mb-2">
      <div className="shadow-lg rounded-2xl p-4 card bg-base-100 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="rounded-xl relative p-2">
              <GiMedicalThermometer className="w-7 h-7 text-error" />
            </span>
            <div className="flex">
              <span className="font-bold text-md ml-2">Thermal Readings</span>
            </div>
          </div>
        </div>

        <div className="mx-2 mb-4 flex justify-between itms-center">
          <p>MIN</p>
          <p className="text-2xl text-orange-300">{tempParser(SYSSTATE.min_temp, 1)}°C</p>
        </div>

        <div className="mx-2 mb-4 flex justify-between itms-center">
          <p>AVG</p>
          <p className="text-2xl text-orange-500">{tempParser(SYSSTATE.average_temp,1)}°C</p>
        </div>

        <div className="mx-2 mb-4 flex justify-between itms-center">
          <p>MAX</p>
          <p className="text-2xl text-error">{tempParser(SYSSTATE.max_temp,1)}°C</p>
        </div>
      </div>
    </div>
  );
};

export default ThermalReadingBlock;
