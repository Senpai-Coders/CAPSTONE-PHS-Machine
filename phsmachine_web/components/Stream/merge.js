import { useEffect, useState } from "react";
import { PI_IP } from "../../helpers";

const merge = () => {
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
    <div className="relative w-full md:w-1/2" style={{ height: "calc(100vh * 0.70)" }}>
      <img
        style={{ height: "calc(100vh * 0.70)" }}
        className="w-full object-fill absolute outline outline-1 outline-base-200 rounded-sm left-0 top-0"
        src={normal}
      />
      <img
        style={{ height: "calc(100vh * 0.70)" }}
        className="w-full object-fill saturate-100 absolute left-0 top-0 opacity-80"
        src={thermal}
      />
      <img
        style={{ height: "calc(100vh * 0.70)" }}
        className="w-full object-fill absolute left-0 top-0 opacity-60"
        src={annotate}
      />
    </div>
  );
};

export default merge;
