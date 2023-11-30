import "./LandingPage.css";
import { useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();

  const mobileNavRef = useRef(null);

  const hanleOpenMobileNav = () => {
    (mobileNavRef.current as HTMLElement | null)?.classList.add("active");
  };

  const hanleCloseMobileNav = () => {
    (mobileNavRef.current as HTMLElement | null)?.classList.remove("active");
  };

  return (
    <div className="LP_WrapCTN">
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
    </div>
  );
};

export default LandingPage;
