import { Button, Tag } from "antd";
// @ts-ignore
import NoticeIcon from "components/NoticeIcon/index.jsx";
import { messaging, onMessageListener, requestForToken } from "lib/firebase";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  maskAsSearchNotifications,
  upsertUserToken,
} from "services/notificationService";
import { NotificationTemplate } from "types/notification";
import "./MyAlert.css";
import { sortBy, uniqBy } from "lodash";

type NoticeStatus = "todo" | "processing" | "urgent" | "doing";
interface Notice {
  status: NoticeStatus;
  id?: string;
  key?: any;
  content: string;
  extra?: any;
  title: string;
  avatar?: string;
  read?: boolean;
  // Add other properties as needed
}

function getNoticeData(notices: NotificationTemplate[]) {
  if (notices.length === 0) {
    return {};
  }
  const newNotices = notices.map((notice: NotificationTemplate) => {
    const newNotice: Notice = { ...notice, read: notice.isRead };
    // transform id to item key
    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }
    if (newNotice.content) {
      const color = {
        todo: "",
        processing: "blue",
        urgent: "red",
        doing: "gold",
      }[newNotice.status];
      newNotice.extra = (
        <Tag color={color} style={{ marginRight: 0, cursor: "pointer" }}>
          {newNotice.content}
        </Tag>
      );
    }
    return newNotice;
  });

  return uniqBy(newNotices, "key").reduce((pre: any, data: any) => {
    if (!pre[data.type]) {
      pre[data.type] = [];
    }
    pre[data.type].unshift(data);
    return pre;
  }, {});
}

// const noticeData = getNoticeData(data);
const MyAlert = () => {
  const [_, setPayload] = useState<Record<string, string>>({});
  const [data, setData] = useState<NotificationTemplate[]>([]);
  const navigate = useNavigate();

  const noticeData = useMemo(() => getNoticeData(data), [data]);

  console.log(noticeData);

  useEffect(() => {
    requestForToken().then((token) => {
      if (!token) {
        return;
      }
      upsertUserToken(token);
    });

    getNotifications().then((notifications) => {
      console.log(notifications);
      setData(notifications || []);
    });
  }, []);

  const onItemClick = (item: any, tabProps: any) => {
    console.log(item, tabProps);
    maskAsSearchNotifications([{ notificationId: item.id, isRead: true }]).then(
      ([notification]) => {
        const newData = data.map((data) => {
          if (data.id === notification.id) {
            return {
              ...data,
              isRead: notification.isRead,
            };
          }

          return data;
        });

        setData(newData);
      }
    );
    navigate(item.redirectEndpoint);
  };

  const onClear = (tabTitle: any) => {
    console.log(tabTitle);
  };

  onMessageListener()
    .then((message: any) => {
      setPayload(message.data);
      setData([
        {
          ...message.data,
          isRead: message.data.isRead === "false" ? false : true,
        },
        ...data,
      ]);
    })
    .catch((err) => console.log("failed: ", err));

  return (
    <NoticeIcon
      className="notice-icon"
      count={data.filter((data) => !data.isRead).length}
      onItemClick={onItemClick}
      onClear={onClear}
      loading={false}
    >
      <NoticeIcon.Tab
        tabKey="notification"
        list={noticeData.notification}
        title="notification"
        emptyText="Empty Notifications"
        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
      />
      <NoticeIcon.Tab
        tabKey="message"
        list={noticeData.message}
        title="message"
        emptyText="Empty Messages"
        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
      />
      <NoticeIcon.Tab
        tabKey="event"
        list={noticeData.event}
        title="event"
        emptyText="Empty Events"
        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
      />
    </NoticeIcon>
  );
};

export default MyAlert;
