import { Avatar, List } from "antd";

import React from "react";
import classNames from "classnames";
import styles from "./NoticeList.less";
import "./notice.css";
// export interface NoticeIconTabProps {
//   count?: number;
//   name?: string;
//   showClear?: boolean;
//   showViewMore?: boolean;
//   style?: React.CSSProperties;
//   title: string;
//   tabKey: string;
//   data?: NoticeIconData[];
//   onClick?: (item: NoticeIconData) => void;
//   onClear?: () => void;
//   emptyText?: string;
//   clearText?: string;
//   viewMoreText?: string;
//   list: NoticeIconData[];
//   onViewMore?: (e: any) => void;
// }
const NoticeList = ({
  data = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }
  return (
    <div style={{ width: "300px" }}>
      <List
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          overflowX: "hidden",
          width: "100%",
          maxWidth: "300px",
        }}
        className={styles.list}
        dataSource={data}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          const leftIcon = item.avatar ? (
            typeof item.avatar === "string" ? (
              <Avatar className={styles.avatar} src={item.avatar} />
            ) : (
              <span className={styles.iconElement}>{item.avatar}</span>
            )
          ) : null;

          return (
            <List.Item
              className={item.read ? 'notice-item read' : "notice-item unread"}
              key={item.key || i}
              onClick={() => onClick && onClick(item)}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>{item.description}</div>
                    <div className={styles.datetime}>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;
