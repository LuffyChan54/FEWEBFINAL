import { BellOutlined } from "@ant-design/icons";
import { Badge, Spin, Tabs } from "antd";
import useMergeValue from "use-merge-value";
import React from "react";
import classNames from "classnames";
import NoticeList from "./NoticeList";

import HeaderDropdown from "../HeaderDropdown";
import styles from "./index.less";

const { TabPane } = Tabs;

// export interface NoticeIconData {
//   avatar?: string | React.ReactNode;
//   title?: React.ReactNode;
//   description?: React.ReactNode;
//   datetime?: React.ReactNode;
//   extra?: React.ReactNode;
//   style?: React.CSSProperties;
//   key?: string | number;
//   read?: boolean;
// }

// export interface NoticeIconProps {
//   count?: number;
//   bell?: React.ReactNode;
//   className?: string;
//   loading?: boolean;
//   onClear?: (tabName: string, tabKey: string) => void;
//   onItemClick?: (item: NoticeIconData, tabProps: NoticeIconTabProps) => void;
//   onViewMore?: (tabProps: NoticeIconTabProps, e: MouseEvent) => void;
//   onTabChange?: (tabTile: string) => void;
//   style?: React.CSSProperties;
//   onPopupVisibleChange?: (visible: boolean) => void;
//   popupVisible?: boolean;
//   clearText?: string;
//   viewMoreText?: string;
//   clearClose?: boolean;
//   emptyImage?: string;
//   children: React.ReactElement<NoticeIconTabProps>[];
// }

const NoticeIcon = (props) => {
  const getNotificationBox = () => {
    const {
      children,
      loading,
      onClear,
      onTabChange,
      onItemClick,
      onViewMore,
      clearText,
      viewMoreText,
    } = props;
    if (!children) {
      return null;
    }
    const panes = [];
    React.Children.forEach(children, (child) => {
      if (!child) {
        return;
      }
      const { list, title, count, tabKey, showClear, showViewMore } =
        child.props;
      const len = list && list.length ? list.length : 0;
      const msgCount = count || count === 0 ? count : len;
      const tabTitle = msgCount > 0 ? `${title} (${msgCount})` : title;
      panes.push(
        // <TabPane tab={tabTitle} key={tabKey}>
        {
          label: tabTitle,
          key: tabKey,
          children: (
            <NoticeList
              clearText={clearText}
              viewMoreText={viewMoreText}
              data={list}
              onClear={() => onClear && onClear(title, tabKey)}
              onClick={(item) => onItemClick && onItemClick(item, child.props)}
              onViewMore={(event) =>
                onViewMore && onViewMore(child.props, event)
              }
              showClear={showClear}
              showViewMore={showViewMore}
              title={title}
              {...child.props}
            />
          ),
        }

        // </TabPane>
      );
    });
    return (
      <Spin spinning={loading} delay={300}>
        <Tabs
          style={{
            backgroundColor: "#fff",
            padding: "16px 32px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
          items={panes}
          className={styles.tabs}
          onChange={onTabChange}
        >
          {/* {panes} */}
        </Tabs>
      </Spin>
    );
  };

  const { className, count, bell } = props;

  const [visible, setVisible] = useMergeValue(false, {
    value: props.popupVisible,
    onChange: props.onPopupVisibleChange,
  });
  const noticeButtonClass = classNames(className, styles.noticeButton);
  const notificationBox = getNotificationBox();
  const NoticeBellIcon = bell || (
    <BellOutlined
      style={{ fontSize: "22px", cursor: "pointer" }}
      className={styles.icon}
    />
  );
  const trigger = (
    <span
      style={{
        display: "flex",
        justifyContent: "center",
      }}
      className={classNames(noticeButtonClass, { opened: visible })}
    >
      <Badge
        count={count}
        style={{ boxShadow: "none" }}
        className={styles.badge}
      >
        {NoticeBellIcon}
      </Badge>
    </span>
  );
  if (!notificationBox) {
    return trigger;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName={styles.popover}
      trigger={["click"]}
      open={visible}
      onOpenChange={setVisible}
    >
      {trigger}
    </HeaderDropdown>
  );
};

NoticeIcon.defaultProps = {
  emptyImage:
    "https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg",
};

NoticeIcon.Tab = NoticeList;

export default NoticeIcon;
