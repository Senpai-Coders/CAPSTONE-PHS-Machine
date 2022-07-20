import React from 'react'
import {  translateSystemState, translateSystemStateToIcon  } from "../../helpers"

const SystemStateBlock = ({SYSSTATE}) => {
  return (
    <div className="mb-2">
                <div className="shadow-lg rounded-2xl p-4 bg-base-100 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="rounded-xl relative p-2 ">
                        {translateSystemStateToIcon(SYSSTATE.status)}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-md  ml-2">
                          System Status
                        </span>
                        <span className="text-sm   ml-2">
                          {translateSystemState(SYSSTATE.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {SYSSTATE.status === 1 && (
                    <progress className="progress progress-primary"></progress>
                  )}
                </div>
              </div>
  )
}

export default SystemStateBlock