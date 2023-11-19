import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import "./sidebar.css";
import logo from "assets/logo.svg";
import { Link, useNavigate } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuProps['items'] = [
    getItem('Khóa học hiện tại', 'sub1', <MailOutlined />, [
        getItem('Lập trình ứng dụng web nâng cao', 'g1', null, [getItem('BTCN1', '1'), getItem('BTCN2', '2')], 'group'),
        getItem('Lập trình ứng dụng web', 'g2', null, [getItem('BTCN1', '3'), getItem('BTCN2', '4')], 'group'),
    ]),

    getItem('Khóa học đã học', 'sub2', <AppstoreOutlined />, [
        getItem('Lập trình window', '5'),
        getItem('Lập trình hướng đối tượng', '6'),
    ]),

    { type: 'divider' },

    getItem('Group', 'grp', null, [getItem('Settings', '13'), getItem('Privacy', '14')], 'group'),
];

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
    };

    return (
        <div id="sidebar">
            <div
                onClick={() => navigate("/classroom/home")}
                className='logo' style={{ cursor: "pointer" }}>
                <img src={logo} alt="" />
            </div>
            <Menu
                onClick={onClick}
                className='sidebar-menu'
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
            />
        </div>
    );
};

export default Sidebar;
