import React from 'react';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { Logout } from 'components/user';
import { Link } from 'react-router-dom';

const items: MenuProps['items'] = [
    {
        label: <Link to="/classroom/profile">Profile</Link>,
        key: '0',
    },
    {
        type: 'divider',
    },
    {
        label: <Logout />,
        key: '1',
    },
];

const UserSetting: React.FC = () => (
    <Dropdown
        menu={{ items }} trigger={['click']} placement="bottomRight">
        <a onClick={(e) => e.preventDefault()}>
            <Space>
                <i className="uil uil-user-circle" style={{ fontSize: "2.5rem", cursor: "pointer" }}></i>
            </Space>
        </a>
    </Dropdown>
);

export default UserSetting;