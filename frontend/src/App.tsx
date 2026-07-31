import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { StoreProvider } from './context/StoreContext';
import { router } from './router/AppRouter';
import './index.css';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#E91E63',
          borderRadius: 12,
          fontFamily: 'Inter, sans-serif',
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f5f5f5',
          colorText: '#333333'
        },
        components: {
          Button: {
            colorPrimary: '#E91E63',
            algorithm: true
          },
          Input: {
            activeBorderColor: '#E91E63',
            hoverBorderColor: '#E91E63'
          }
        }
      }}
    >
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </ConfigProvider>
  );
};

export default App;
