import ReactEcharts from "echarts-for-react";

const MorphChart = ({ option, data }) => {
  return (
    <div className="h-64">
      <ReactEcharts
        option={option}
        style={{ height: "100%", left: 50, top: 50, width: "90vw" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
};

export default MorphChart;

