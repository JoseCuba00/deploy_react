import React from "react";
import { Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingIndicator = () => (
  <Space>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 70 }} spin />} />
  </Space>
);

export default LoadingIndicator;
