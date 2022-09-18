import ReactEcharts from "echarts-for-react";

const HeatMapCalendar = ({ option, onEvents }) => {
  return (
    <div className="h-64">
      <ReactEcharts
        onEvents={onEvents}
        option={option}
        style={{ height: "40vh", width: "100%" }}
        theme={"infographic"}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};

export default HeatMapCalendar;
