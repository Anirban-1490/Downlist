import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../src/Stats-Anime/header";
import { HomeMain } from "./Stats-Anime/Pages/Home";
import { TopAnimeMain } from "./Stats-Anime/Pages/Top/TopAnime";
import { TopacharMain } from "./Stats-Anime/Pages/Top/TopCharacter";
import Details from "../src/Stats-Anime/details";
import Detailschar from "../src/Stats-Anime/details-char";
import Listuser from "../src/Stats-Anime/list-user";
import ScrollToTop from "../src/Stats-Anime/scrollTotop";
import { About } from "./Stats-Anime/Pages/About";
import { Errorpage } from "./Stats-Anime/error";
import { SignupMain } from "./Stats-Anime/Signup";
import { UserProfileMain } from "./Stats-Anime/user_profile";
import { ReadOnlyProfileMain } from "./Stats-Anime/User_Profile_Read_Only";

function App() {
  //* route starts
  return (
    <>
      <Router>
        <ScrollToTop />
        <Header />
        <div className="inner-root-container">
          <Routes>
            <Route index path="/" element={<HomeMain />} />

            <Route path="/topanime" element={<TopAnimeMain />} />

            <Route path="/topcharacters" element={<TopacharMain />} />

            <Route path="/about" element={<About />} />

            <Route path="/user/:userID/view" element={<UserProfileMain />} />
            <Route path="/user/:userID" element={<ReadOnlyProfileMain />} />

            <Route
              path="/useranimelist/:userID"
              element={<Listuser header="anime list" switch_item="anime" />}
            />

            <Route
              path="/usercharacterlist/:userID"
              element={
                <Listuser header="character list" switch_item="character" />
              }
            />

            <Route path="anime/:id" element={<Details />} />
            <Route path="character/:id" element={<Detailschar />} />

            <Route path="userauth" element={<SignupMain />} />
            {/* routing to non-existing path */}
            <Route path="*" element={<Errorpage />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
