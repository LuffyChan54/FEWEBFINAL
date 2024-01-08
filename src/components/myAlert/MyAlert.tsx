import { Tag } from "antd";
// @ts-ignore
import NoticeIcon from "components/NoticeIcon/index.jsx";
import { onMessage } from "firebase/messaging";
import { messaging, onMessageListener, requestForToken } from "lib/firebase";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, upsertUserToken } from "services/notificationService";
const data = [
  {
    id: "000000001",
    key: "000000001",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "你收到了 14 份新周报",
    datetime: "2017-08-09",
    type: "notification",
  },
  {
    id: "000000002",
    key: "000000002",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
    title: "你推荐的 曲妮妮 已通过第三轮面试",
    datetime: "2017-08-08",
    type: "notification",
  },
  {
    id: "000000003",
    key: "000000003",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png",
    title: "这种模板可以区分多种通知类型",
    datetime: "2017-08-07",
    read: true,
    type: "notification",
  },
  {
    id: "000000004",
    key: "000000004",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png",
    title: "左侧图标用于区分不同的类型",
    datetime: "2017-08-07",
    type: "notification",
  },
  {
    id: "000000005",
    key: "000000005",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "内容不要超过两行字，超出时自动截断",
    datetime: "2017-08-07",
    type: "notification",
  },
  {
    id: "000000006",
    key: "000000006",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
    title: "曲丽丽 评论了你",
    description: "描述信息描述信息描述信息",
    datetime: "2017-08-07",
    type: "message",
    clickClose: true,
  },
  {
    id: "000000007",
    key: "000000007",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
    title: "朱偏右 回复了你",
    description: "这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像",
    datetime: "2017-08-07",
    type: "message",
    clickClose: true,
  },
  {
    id: "000000008",
    key: "000000008",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
    title: "标题",
    description: "这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像",
    datetime: "2017-08-07",
    type: "message",
    clickClose: true,
  },
  {
    id: "000000009",
    key: "000000009",
    title: "任务名称",
    description: "任务需要在 2017-01-12 20:00 前启动",
    extra: "未开始",
    status: "todo",
    type: "event",
  },
  {
    id: "000000010",
    key: "000000010",
    title: "第三方紧急代码变更",
    description: "冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务",
    extra: "马上到期",
    status: "urgent",
    type: "event",
  },
  {
    id: "000000011",
    key: "000000011",
    title: "信息安全考试",
    description: "指派竹尔于 2017-01-09 前完成更新并发布",
    extra: "已耗时 8 天",
    status: "doing",
    type: "event",
  },
  {
    id: "000000012",
    key: "000000012",
    title: "ABCD 版本发布",
    description: "冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务",
    extra: "进行中",
    status: "processing",
    type: "event",
  },
];
type NoticeStatus = "todo" | "processing" | "urgent" | "doing";
interface Notice {
  status: NoticeStatus;
  id: string;
  key: any;
  content: string;
  extra: any;
  title: string;
  avatar?: string;
  // Add other properties as needed
}

function getNoticeData(notices: any) {
  if (notices.length === 0) {
    return {};
  }
  const newNotices = notices.map((notice: any) => {
    const newNotice: Notice = { ...notice };
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
        <Tag color={color} style={{ marginRight: 0 }}>
          {newNotice.content}
        </Tag>
      );
      newNotice.title = notice.name;
      newNotice.avatar = notice.avatar;
    }
    return newNotice;
  });

  console.log("new Data", newNotices);
  return newNotices.reduce((pre: any, data: any) => {
    if (!pre[data.type]) {
      pre[data.type] = [];
    }
    pre[data.type].push(data);
    return pre;
  }, {});
}

// const noticeData = getNoticeData(data);
const MyAlert = () => {
  const [_, setPayload] = useState<Record<string, string>>({});
  const [data, setData] = useState<any>([]);
  const navigate = useNavigate();

  const noticeData = useMemo(() => getNoticeData(data), [data])
  useEffect(() => {
    requestForToken()
      .then(token => {
        if(!token) {
          return;
        }
        upsertUserToken(token);
      })

     getNotifications()
      .then(notifications => {
        console.log(notifications)
        setData(notifications || []);
      })
  }, []);

  const onItemClick = (item: any, tabProps: any) =>  {
    console.log(item, tabProps)
    navigate(item.redirectEndpoint);
  }

  const onClear = (tabTitle: any) => {
    console.log(tabTitle)
  }

  
  onMessageListener()
    .then((message: any) => {
      setPayload(message.data);
      setData([...data, message.data]);
    })
    .catch((err) => console.log('failed: ', err));
  return  (<NoticeIcon
    className="notice-icon"
    count={data.length}
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
  </NoticeIcon>);
}

export default MyAlert;
