import React from "react";

import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Reservations from "../reservations/Reservations";
import Tables from "../tables/Tables";
import Seat from "../reservations/Seat";
import Search from "../search/Search";
import Edit from "../reservations/Edit";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dateParam = queryParams.get("date");
  //console.log("ROUTE DATE: ", dateParam);

  return (
    <Switch>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route exact={true} path="/reservations/new">
        <Reservations />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seat  />
      </Route>
      {/*<Route exact={true} path="/reservations/:reservation_id/edit">
        <Edit  />
      </Route>*/}
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables/new">
        <Tables date={today()} />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/tables/new"} />
      </Route>
      <Route path="/dashboard/:date?">
        <Dashboard date={dateParam || today()} />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;