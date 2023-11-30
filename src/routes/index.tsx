import { createBrowserRouter } from "react-router-dom";
import LandingPage from "pages/landingPage/LandingPage";
import HomePage from "pages/homePage/HomePage";
import AuthPage from "pages/authPage/AuthPage";
import {
  NavigateFromProtectToUnProtectRoute,
  ProtectRouter,
} from "components/auth";
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
      },
    ],
  },
]);
