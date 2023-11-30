import { getAuthReducer, update } from "@redux/reducer";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { DatePicker, Spin } from "antd";
import { UploadImage } from "components/image";
import * as userService from "services/userService";
import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";

export default function Profile() {
  const { user } = useSelector(getAuthReducer);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState({
    firstName: user.fullname.split(" ")[0],
    lastName: user.fullname.split(" ").slice(1).join(" "),
    birthday: user.birthday,
    notes: user.notes,
    avatar: user.avatar,
  });

  const handleChange = () => {
    setIsLoading(true);
    const payload = {
      ...input,
      fullname: input.firstName + " " + input.lastName,
    };
    userService
      .updateUser(payload)
      .then((_) => {
        dispatch(update(payload));
        toast("Update user information successfully", { type: "success" });
      })
      .catch((err) => {
        toast(err?.response?.data.message, { type: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container-xl px-4 mt-4">
      <div className="row">
        <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Profile Picture</div>
            <div className="card-body text-center">
              <img
                className="mb-2"
                src={
                  input.avatar ||
                  "http://bootdey.com/img/Content/avatar/avatar1.png"
                }
                style={{ maxWidth: "200px", borderRadius: "10px" }}
              />
              <div className="small font-italic text-muted mb-4">
                JPG or PNG no larger than 5 MB
              </div>
              <UploadImage
                url={input.avatar}
                setUrl={(url: string) => setInput({ ...input, avatar: url })}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Account Details</div>
            <div
              className="card-body"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="mb-3">
                <label className="small mb-1">Username</label>
                <input
                  value={user.email}
                  className="form-control"
                  type="text"
                  disabled
                />
              </div>
              <div className="row gx-3 mb-3">
                <div className="col-md-6">
                  <label className="small mb-1">First name</label>
                  <input
                    onChange={(e) =>
                      setInput({ ...input, firstName: e.target.value })
                    }
                    className="form-control"
                    type="text"
                    placeholder="Enter your first name"
                    value={input.firstName}
                  />
                </div>
                <div className="col-md-6">
                  <label className="small mb-1">Last name</label>
                  <input
                    onChange={(e) =>
                      setInput({ ...input, lastName: e.target.value })
                    }
                    className="form-control"
                    type="text"
                    placeholder="Enter your last name"
                    value={input.lastName}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="small mb-1">Birthday</label>
                <DatePicker
                  defaultValue={dayjs(input.birthday, "YYYY-MM-DD")}
                  onChange={(_, date) => setInput({ ...input, birthday: date })}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="small mb-1">Notes</label>
                <input
                  onChange={(e) =>
                    setInput({ ...input, notes: e.target.value })
                  }
                  value={input.notes}
                  className="form-control"
                  type="text"
                />
              </div>
              <div style={{ margin: "0 auto" }}>
                <button
                  style={{ minWidth: "150px" }}
                  onClick={() => handleChange()}
                  className="btn btn-primary"
                  type="button"
                >
                  {
                    <>
                      {isLoading ? (
                        <Spin style={{ marginRight: "1rem" }} />
                      ) : (
                        <></>
                      )}
                      {isLoading ? "Loading..." : "Update"}
                    </>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer pauseOnHover />
    </div>
  );
}
