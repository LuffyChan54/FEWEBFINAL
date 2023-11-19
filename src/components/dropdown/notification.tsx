import React from 'react';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

const items: MenuProps['items'] = [
    {
        label: <a href="https://www.antgroup.com">New Assignment</a>,
        key: '0',
    },
    {
        label: <a href="https://www.aliyun.com">New Assignment</a>,
        key: '1',
    }
];

const Notification: React.FC = () => (
    <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight'>
        <a onClick={(e) => e.preventDefault()}>
            <Space>
                <i style={{ fontSize: "2.5rem", cursor: "pointer" }}
                    className="uil uil-bell"></i>
            </Space>
        </a>
    </Dropdown>
);

export default Notification;