import { useEffect, useState } from "react";
import { PI_IP } from "../../helpers";

const triple = () => {
  const [normal, setNormal] = useState(undefined);
  const [thermal, setThermal] = useState(undefined);
  const [annotate, setAnnotate] = useState(undefined);

  const loadImage = () => {
    try {
      fetch(`http://${PI_IP}:8000/normal`)
        .then((response) => response.blob())
        .then((imageBlob) => {
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setNormal(imageObjectURL);
        }).catch(function(error) {
        });

        fetch(`http://${PI_IP}:8000/thermal`)
        .then((response) => response.blob())
        .then((imageBlob) => {
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setThermal(imageObjectURL);
        }).catch(function(error) {
        });

        fetch(`http://${PI_IP}:8000/annotate`)
        .then((response) => response.blob())
        .then((imageBlob) => {
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setAnnotate(imageObjectURL);
        }).catch(function(error) {
        });
    } catch (e) {}
  };

  useEffect(() => {
    var loader = setInterval(async () => {
      loadImage();
    }, 800);

    return () => {
      clearInterval(loader);
    };
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-full">
      {/* normal */}
      <div className="min-h-12">
        <img
          className="w-full outline outline-1 outline-base-100 rounded-sm"
          src={normal}
        />
      </div>
      {/* thermal */}
      <div className="min-h-12">
        <img
          className="w-full outline outline-1 outline-base-100 rounded-sm"
          src={thermal}
        />
      </div>
      {/* annotation */}
      <div className="min-h-12">
        <img
          className="w-full outline outline-1 outline-base-100 rounded-sm"
          src={annotate}
        />
      </div>
    </div>
  );
};

export default triple;
