import './App.css';
import Pages from './Components/Pages';

export default function App() {
  return (
    <div className='App'>
      <Pages.Signup />
      <Pages.Login />
      <Pages.Home />
    </div>
  );
}
