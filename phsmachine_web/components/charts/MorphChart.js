import ReactEcharts from "echarts-for-react";

const MorphChart = ({ option, onEvents }) => {
  return (
    <div className="h-full">
      <ReactEcharts
        onEvents={onEvents}
        option={option}
        style={{ height: "100%", width: "100%" }}
        theme={'infographic'}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};

export default MorphChart;

