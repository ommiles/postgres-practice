import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Nav } from './Components/Shared/Nav';
import { Routes } from './Components/Routes/Routes';

export const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Nav />
        <Routes />
      </BrowserRouter>
    </div>
  );
};
