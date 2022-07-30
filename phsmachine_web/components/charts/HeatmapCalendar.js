import ReactEcharts from "echarts-for-react";

const HeatMapCalendar = ({ option }) => {
  return (
    <div className="h-64">
      <ReactEcharts
        option={option}
        style={{ height: "40vh", width: "100%" }}
        theme={'infographic'}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};

export default HeatMapCalendar;

