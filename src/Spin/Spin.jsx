import React from "react";
import "./SpinStyle.css";
import { Spin } from "antd";
const Spinner = () => (
  <div className="spinner">
    <Spin style={{ width: "400px", height: "100px", margin: "50px auto" }} />
  </div>
);
export default Spinner;
