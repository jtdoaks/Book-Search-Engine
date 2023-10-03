import './App.css';
import { Outlet } from 'react-router-dom';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloProvider } from '@apollo/client';


import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
    </>
  );
}

export default App;
