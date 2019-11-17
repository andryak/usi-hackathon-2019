## BikeMeThere

BikeMeThere is an application for getting around Lugano (potentially other
cities as well) with PubliBike.

A working demo of the application is available here: [BikeMeThere](https://zuccha.github.io/bike-me-there)

### Move around by bike

The application will suggest the fastest routes for going towards your 
destination (à la Google Maps), by taking into account the rental service
provided by PubliBike. The app will also inform you about the estimated number
of bikes available in all PubliBike station, making sure you don't end up in a
station without any bike available.

### Be part of the solution

When asking for directions, the application might also suggest you slightly less
optimal routes, asking you to park bikes in stations slightly more distant from
your destination. Why, you ask? If you park your bike in a station with low
availability, you will be rewarded with awesome prices! This way, BikeMeThere
will ensure bikes are always available in all PubliBike stations.

### Sustainability and cooperation

The aim of BikeMeThere is to encourage people to move around in a eco-friendly
way. Helping moving bikes to stations with low availability is not only a way
for people to get rewarded with prices and a sense of self-accomplishment, but
it is also a way to further improve sustainability by reducing the need of
car-based services for transporting bikes from one station to another. In
addition to that, the PubliBike service will also be more reliable.


## How to Run

The application is written in React and is aimed for running in all major
browsers.

### Prerequisites

You will need the following tools
- [Yarn](https://yarnpkg.com/lang/en/)
- [Node](https://nodejs.org/en/), version 11 (newer versions are not supported
by React)

### Installation

First, install dependencies with
```
yarn install
```

Then, you will need to add a `.env` file in the root of the project, containing
the Google API key needed for getting directions and displaying the map
```
REACT_APP_GOOGLE_KEY=<api_key>
```

### Run

To try the application, run
```
yarn start
```
The application should open automatically in the browser, at the address
`http://localhost:3000`.
