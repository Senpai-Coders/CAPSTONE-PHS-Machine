import { API } from "../../helpers";
import { useState } from "react";
import { GoCircuitBoard } from "react-icons/go";
import { BsFillSaveFill } from "react-icons/bs"



const c_relay = ( {onClose} ) => {
  const [config_name, setConfig_name] = useState("");
  const [description, setDescription] = useState("");
  const [GPIO_PIN, setGPIO_PIN] = useState("");

  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("");

  const save = async() => { 
    try{
        setLoading(true)
        const add = await API.post("/api/phs/config/relays", {
            mode:0, 
            config_name,
            description,
            GPIO_PIN : parseInt(GPIO_PIN)
        })
        setLoading(false)
        onClose()
    }catch(e){
        setLoading(false);
        console.log(e.response.data.message)
        if (e.response) {
          //request was made but theres a response status code
          if (e.response.status === 409)
            setErr(e.response.data.message);
        }
    }
  }

  const canSave = () => {
      if(config_name.length === 0) return false
      if(description.length === 0) return false
      if(GPIO_PIN.length === 0 || isNaN(parseInt(GPIO_PIN))) return false
      return true
  }

  return (
    <label className="modal-box w-full md:w-11/12" htmlFor="">
      <div className="flex items-center justify-between my-4">
        <h3 className="font-bold text-lg">New Relay</h3>{" "}
        <GoCircuitBoard className="w-6 h-6" />
      </div>
      <div className="alert text-warning shadow-lg">
        <div>
          <span className="text-sm">
            Warning: Make Sure You Know what you are doing, Relays handles 0 -
            250 Volts AC. Please be careful when plugging in new components into
            them!
          </span>
        </div>
      </div>
      <div className="mt-2">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
            Components Name
          </label>
          <input
            type="text"
            placeholder="ex: Relay 1, Fan, Pump"
            value={config_name}
            onChange={(e) => {
              setErr("");
              setConfig_name(e.target.value);
            }}
            className={`tracking-wider input input-bordered w-full input-md ${
              err === "username" ? "input-error" : ""
            }`}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
            Description
          </label>
          <input
            type="text"
            placeholder="Short Description"
            value={description}
            onChange={(e) => {
              setErr("");
              setDescription(e.target.value);
            }}
            className={`tracking-wider input input-bordered w-full input-md ${
              err === "username" ? "input-error" : ""
            }`}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium  dark:text-gray-300">
            GPIO Pin
          </label>
          <input
            type="text"
            placeholder="GPIO Pin, ex : 24, 18, 17"
            value={GPIO_PIN}
            onChange={(e) => {
              setErr("");
              setGPIO_PIN(e.target.value);
            }}
            className={`tracking-wider input input-bordered w-full input-md ${
              err === "username" ? "input-error" : ""
            }`}
            required
          />
        </div>
        <p className="text-center text-error font-inter text-sm">{err}</p>
      </div>
      
      <div className="modal-action">
        <label  onClick={()=>{ setLoading(false); onClose() }} className="btn">
          Cancel 
        </label>
        <button disabled={ !canSave() } onClick={()=>save()}  className={`btn ${loading ? "loading" : ""}`}>
          Save <BsFillSaveFill className="ml-3 w-4 h-4" />
        </button>
      </div>
    </label>
  );
};

export default c_relay;
