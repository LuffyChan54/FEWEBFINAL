import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { ToastContainer, toast } from "react-toastify";
import * as AuthService from "services/authService";
import { useDispatch } from "react-redux";
import { signin } from "@redux/reducer";
import "./landingPage.css";

type ParamsObject = {
  [key: string]: string;
};

const LandingPage = () => {
  const spinRef = useRef(null);
  const isSocialLogin = useRef(false);
  const location = useLocation();
  const dispatch = useDispatch();
  // check if from social login redirect:
  const url = window.location.href;
  if (url.includes("code")) {
    isSocialLogin.current = true;
  }

  useEffect(() => {
    if (isSocialLogin.current) {
      // Extract the value of the 'code' query parameter from the URL
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get("code") || "";

      AuthService.getTokenSocialLogin(code)
        .then(({ userInfo, token }) => {
          dispatch(
            signin({
              user: userInfo,
              token
            })
          );
          toast.success("Log In Successfully", { theme: "colored" });
        })
        .catch((err) => {
          console.log(err);
          toast.warning(err?.response?.data.message, {
            theme: "colored",
          });
        })
        .finally(() => {
          const spinElement = spinRef.current as unknown as HTMLDivElement;
          if (spinElement?.style) {
            spinElement.style.display = "none";
          }
        });
    }
    return;
  }, []);

  const mobileNavRef = useRef(null);

  const hanleOpenMobileNav = () => {
    (mobileNavRef.current as HTMLElement | null)?.classList.add("active");
  };

  const hanleCloseMobileNav = () => {
    (mobileNavRef.current as HTMLElement | null)?.classList.remove("active");
  };

  return (
    <div className="LP_WrapCTN">
      {isSocialLogin.current && (
        <div ref={spinRef}>
          <Spin fullscreen={true} />
        </div>
      )}

      <div className="LP_HeroCTN">
        <div className="LP_Hero_Nav Nav_Desktop ">
          <div className="LP_Nav_Logo">
            <img src="/imgs/logo.png" />
          </div>
          <div className="LP_Nav_BTNS">
            <div className="LP_Nav_BTNS_Login">
              <span className="Sub_Login">HAVE AN ACCOUNT?</span>{" "}
              <Link to="/auth" className="Login">
                LOG IN
              </Link>
            </div>
            <div className="LP_Nav_BTNS_Login">
              <Link to="/auth" className="Get_Started">
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
        <div className="LP_Hero_Nav Nav_Mobile ">
          <div className="LP_Nav_Logo">
            <img src="/imgs/logo.png" />
          </div>
          <div
            onClick={() => hanleOpenMobileNav()}
            className="LP_MobileNav_Open"
          >
            <img src="/imgs/openlist.png" />
          </div>
          <div ref={mobileNavRef} className="LP_MobileNav ">
            <div className="LP_Nav_BTNS_Login">
              <span className="Sub_Login">HAVE AN ACCOUNT?</span>{" "}
              <Link to="/auth" className="Login">
                LOG IN
              </Link>
            </div>
            <div className="LP_Nav_BTNS_Login">
              <Link to="/auth" className="Get_Started">
                GET STARTED
              </Link>
            </div>
            <div className="MobileNav_Empty_Div"></div>
            <div
              onClick={() => hanleCloseMobileNav()}
              className="LP_MobileNav_Close"
            >
              <img src="/imgs/closelist.png" />
            </div>
          </div>
        </div>
        <div className="LP_Hero_Content">
          <div className="Content_LeftCTN">
            <h1 className="LeftCTN_Title">
              Guide and reward <br />
              student <span className="highlight">success</span>
            </h1>
            <div className="LeftCTN_SubTitle">
              HPClass helps you set the right goals to earn <br />
              rewards you want on your way to success!
            </div>
            <div className="LeftCTN_WrapBTN">
              <Link to="/auth" className="Get_Started">
                GET STARTED
              </Link>
            </div>
          </div>
          <div className="Content_RightCTN"></div>
        </div>

        <div className="LP_Hero_BotWave">
          <img src="/imgs/botwave.svg" />
        </div>
        <div className="LP_Hero_TopWave">
          <img src="/imgs/wavetop.svg" />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LandingPage;
