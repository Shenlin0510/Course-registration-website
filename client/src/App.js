import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/nav-components";
import Home from "./components/home-component";
import Register from "./components/register-components";
import Login from "./components/login-components";
import Profile from "./components/profile-component";
import AuthServices from "./services/auth.services";
import Course from "./components/course-component";
import PostCourse from "./components/postCourse-component";
import Enroll from "./components/enroll-component";

const App = () => {
  let [currentUser, setCurrentUser] = useState(AuthServices.getCurrentUser());

  return (
    <div>
      <Nav currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route
          path="/"
          element={
            <Home currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        />
        <Route
          path="/course"
          element={
            <Course currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        />
        <Route
          path="/postCourse"
          element={
            <PostCourse
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path="/enroll"
          element={
            <Enroll currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
