import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ParentNavbar } from "./Stats-Anime/Components/Navbar";
import { HomeMain } from "./Stats-Anime/Page/Home";
import { TopAnimeMain } from "./Stats-Anime/Page/Top/TopAnime";
import { TopacharMain } from "./Stats-Anime/Page/Top/TopCharacter";
import { AnimeDetailsMain } from "./Stats-Anime/Page/Details/DetailsForAnime";
import { CharacetrDetailsMain } from "./Stats-Anime/Page/Details/DetailsForCharacter";

import { MainListContainer } from "./Stats-Anime/Page/UserList";
import { ScrollToTop } from "./Stats-Anime/Components/ScrollToTop/ScrollToTop";
import { About } from "./Stats-Anime/Page/About";
import { PageNotFound } from "./Stats-Anime/Components/PageNotFound/PageNotFound";
import { UserAuthentication } from "./Stats-Anime/Page/UserAuthentication";
import { UserProfileMain } from "./Stats-Anime/user_profile";
import { ReadOnlyProfileMain } from "./Stats-Anime/User_Profile_Read_Only";

function App() {
  //* route starts
  return (
    <>
      <Router>
        <ScrollToTop />
        <ParentNavbar />

        <Routes>
          <Route index path="/" element={<HomeMain />} />

          <Route path="/topanime" element={<TopAnimeMain />} />

          <Route path="/topcharacters" element={<TopacharMain />} />

          <Route path="/about" element={<About />} />

          <Route path="/user/:userID/view" element={<UserProfileMain />} />
          <Route path="/user/:userID" element={<ReadOnlyProfileMain />} />

          <Route
            path="/useranimelist/:userID"
            element={
              <MainListContainer header="anime list" switch_item="anime" />
            }
          />

          <Route
            path="/usercharacterlist/:userID"
            element={
              <MainListContainer
                header="character list"
                switch_item="character"
              />
            }
          />

          <Route path="anime/:id" element={<AnimeDetailsMain />} />
          <Route path="character/:id" element={<CharacetrDetailsMain />} />

          <Route path="userauth" element={<UserAuthentication />} />
          {/* routing to non-existing path */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
