import { Col, Row, Tabs } from "antd";
import React from "react";

const Reviews = () => {
  return (
    <Row>
      <Col span={16}>
        <div>
          <Tabs
            defaultActiveKey="1"
            size="small"
            style={{ marginBottom: 10 }}
            items={new Array(3).fill(null).map((_, i) => {
              const id = String(i + 1);
              return {
                label: `Tab ${id}`,
                key: id,
                children: `Content of tab ${id}`,
              };
            })}
          />
          <Tabs
            defaultActiveKey="1"
            type="card"
            size="small"
            items={new Array(3).fill(null).map((_, i) => {
              const id = String(i + 1);
              return {
                label: `Card Tab ${id}`,
                key: id,
                children: `Content of card tab ${id}`,
              };
            })}
          />
        </div>
      </Col>
      <Col span={8}>CHAT</Col>
    </Row>
  );
};

export default Reviews;
