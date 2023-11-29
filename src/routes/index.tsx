import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { AnonymousLayout, UserLayout } from "./layouts";
import { Signin, Signup } from "pages/landingPage";
import { ProtectRouter } from "components/auth";
import Home from "pages/home/home";
import { NavigateFromProtectToUnProtectRoute } from "components/auth";
import { Profile } from "pages/profile";
import LandingPage from "pages/landingPage/LandingPage";
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
    path: "/",
    element: <LandingPage />,
  },
]);
