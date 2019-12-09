import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navbar from "./component/navbar/Navbar"
import Home from "./component/home/Home"
import Navigation from "./component/Navigation";
import Signup from "./component/Signup";
import Login from "./component/Login";
import Profile from "./signin/Profile";
import {Row,Container,Col } from 'reactstrap';


class App extends React.Component{
    
  render(){
    return (
      <Router>
        <div className="App">
          <Navbar  />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/navigation" component={Navigation} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            {/* <Route component={NoMatch} /> */}
           
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;