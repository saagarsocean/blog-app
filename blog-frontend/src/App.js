import React from 'react';
import {AuthProvider} from '../src/context/AuthContext';
import RoutesComponent from './routes';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <RoutesComponent />
      </AuthProvider>
    </Router>
  );
};

export default App;
