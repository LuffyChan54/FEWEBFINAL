import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routes } from "routes";
import { Provider } from "react-redux";
import "./assets/style.css";
import "react-toastify/dist/ReactToastify.css";
import { store } from "@redux";
import { ConfigProvider } from "antd";
import { preload } from "swr";
import {
  getClassOV,
  ClassOVEndpoint as cacheKey,
} from "services/classOVService";
import { firebaseConfig } from "lib/firebase";
preload(cacheKey, getClassOV);

if ('serviceWorker' in navigator) {
  const firebaseConfigParams = new URLSearchParams(firebaseConfig).toString();
  navigator.serviceWorker
    .register(`/firebase-messaging-sw.js?${firebaseConfigParams}`)
    .then(function (registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function (err) {
      console.log('Service worker registration failed, error:', err);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#23b574",
          colorPrimaryActive: "#146842",
          colorPrimaryBorder: "#23b574",
          colorPrimaryHover: "#146842",
        },
        components: {
          Spin: {
            colorPrimary: "#23b574",
          },
        },
      }}
    >
      <RouterProvider router={routes} />
    </ConfigProvider>
  </Provider>
);
