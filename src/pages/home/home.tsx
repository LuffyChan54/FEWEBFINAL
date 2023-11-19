import { Card, Col, Row } from "antd";

export default function Home() {
    return <Row gutter={16} style={{ marginTop: "3rem" }}>
        <Col span={8}>
            <Card title="Card title" bordered={false}>
                Course One
            </Card>
        </Col>
        <Col span={8}>
            <Card title="Card title" bordered={false}>
                Course Two
            </Card>
        </Col>
        <Col span={8}>
            <Card title="Card title" bordered={false}>
                Course Three
            </Card>
        </Col>
    </Row>
}