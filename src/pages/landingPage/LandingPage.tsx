import { Link } from "react-router-dom";
import "./LandingPage.css";
const LandingPage = () => {
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
              <Link to="/" className="Login">
                LOG IN
              </Link>
            </div>
            <div className="LP_Nav_BTNS_Login">
              <Link to="/" className="Get_Started">
                GET STARTED
              </Link>
            </div>
          </div>
        </div>
        <div className="LP_Hero_Nav Nav_Mobile "></div>
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
              <div className="Get_Started">GET STARTED</div>
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
