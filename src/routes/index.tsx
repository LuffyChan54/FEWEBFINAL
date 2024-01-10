import { createBrowserRouter } from "react-router-dom";
import LandingPage from "pages/landingPage/LandingPage";
import HomePage from "pages/homePage/HomePage";
import AuthPage from "pages/authPage/AuthPage";
import {
  NavigateFromProtectToUnProtectRoute,
  ProtectRouter,
} from "components/auth";
import VerifyEmailPage from "pages/verifyEmailPage/VerifyEmailPage";
import ClassPage from "pages/classPage/ClassPage";
import TemporaryPage from "pages/temporary/TemporaryPage";
import UserInfo from "pages/userInfo/UserInfo";
import AdminPage from "pages/adminPage/adminPage";
import AdminClassPage from "pages/adminPage/adminClassPage";
import AdminLayout from "layouts/globalLayout/AdminLayout";
import ProtectRoute, {
  NavigateToAdminRoute,
} from "components/auth/protectRouter";
import Unauthorized from "pages/errorPage/403";
// export const routes = createRoutesFromElements(
//     <Route>
//         <Route path="/" element={<AnonymousLayout />}>
//             <Route element={<NavigateFromProtectToUnProtectRoute />}>
//                 <Route index element={<Signin />} />
//                 <Route path="signup" element={<Signup />} />
//                 <Route path="signin" element={<Signin />} />
//             </Route>
//         </Route>
//         <Route path="/classroom" element={<UserLayout />}>
//             <Route element={<ProtectRouter allowRoles={["USER"]} />}>
//                 <Route element={<Home />} path="home" />
//                 <Route
//                     element={<Profile />}
//                     path="profile" />
//             </Route>
//         </Route>
//     </Route>
// )

export const routes = createBrowserRouter([
  {
    element: <NavigateFromProtectToUnProtectRoute />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
    ],
  },
  {
    element: <ProtectRouter />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
        children: [
          {
            path: "/home/verify_email",
            element: <VerifyEmailPage />,
          },
          {
            path: "/home/user_info",
            element: <UserInfo />,
          },
          {
            path: "/home/course/:courseId",
            element: <ClassPage />,
          },
        ],
      },
    ],
  },
  {
    element: <NavigateToAdminRoute />,
    children: [
      {
        path: "/",
        element: <AdminLayout />,
        children: [
          {
            path: "/admin",
            element: <AdminPage />,
          },
          {
            path: "/admin/course",
            element: <AdminClassPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/course/attendee",
    element: <TemporaryPage />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
