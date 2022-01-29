import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/Home/Home';

function App() {
  return (
    <Router>
      {/* <Wrapper */}
        <Routes>
          <Route path='/' element={ <HomePage /> } />
          {/* <Route path='/username' element={ <UsernamePage /> } /> */}
          {/* <Route path='/console' element={ <ConsolePage /> } /> */}
          {/* <Route path='/board/:boardID' element={ <BoardPage /> } /> */}
        </Routes>

        <div className="bkgd1"></div>
        <div className="bkgd2"></div>
      {/* </Wrapper> */}
    </Router>
  );
}

export default App;
