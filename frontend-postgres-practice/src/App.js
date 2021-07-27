import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Nav } from './Shared/Nav';
import { Routes } from './Components/Routes/Routes';

export const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes />
    </BrowserRouter>
  );
};
