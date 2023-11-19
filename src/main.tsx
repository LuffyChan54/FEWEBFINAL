import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from 'routes'
import { Provider } from "react-redux";
import "./assets/style.css";
import 'react-toastify/dist/ReactToastify.css';
import { store } from '@redux';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ConfigProvider theme={{
      components: {
        Spin: {
          colorPrimary: "black"
        }
      }
    }}>
      <RouterProvider router={createBrowserRouter(routes)} />
    </ConfigProvider>
  </Provider>
)
