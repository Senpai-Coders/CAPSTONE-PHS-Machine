import { useEffect, useState } from "react";
import { PI_IP } from "../../helpers";

const dual = () => {
  const [normal, setNormal] = useState(undefined);
  const [thermal, setThermal] = useState(undefined);

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
    <div className="md:grid md:grid-cols-2 w-full">
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
    </div>
  );
};

export default dual;
