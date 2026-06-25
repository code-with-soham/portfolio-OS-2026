export const mockCollections = {
  movies: [
    {
      _id: { $oid: "573a1390f29313caabcd4135" },
      plot: "Three men hammer on an anvil and pass a bottle of beer around.",
      genres: ["Short"],
      runtime: 1,
      cast: ["Charles Kayser", "John Ott"],
      num_mflix_comments: 1,
      title: "Blacksmith Scene",
      fullplot: "A stationary camera looks at a large anvil with a blacksmith behind it and one on either side. The smith in the middle draws a heated metal rod from the fire, places it on the anvil, and all three begin a rhythmic hammering. After several blows, the metal goes back in the fire. One smith pulls out a bottle of beer, and they each take a swig. Then, out comes the glowing metal and the hammering resumes.",
      countries: ["USA"],
      released: { $date: "1893-05-09T00:00:00Z" },
      directors: ["William K.L. Dickson"],
      rated: "UNRATED",
      awards: { wins: 1, nominations: 0, text: "1 win." },
      lastupdated: "2015-08-26 00:03:50.133000000",
      year: 1893,
      imdb: { rating: 6.2, votes: 1189, id: 5 },
      type: "movie",
      tomatoes: {
        viewer: { rating: 3, numReviews: 184, meter: 32 },
        lastUpdated: { $date: "2015-06-28T18:34:09Z" }
      }
    },
    {
      _id: { $oid: "573a1390f29313caabcd42e8" },
      plot: "A group of bandits stage a brazen train hold-up, only to find a determined posse hot on their heels.",
      genres: ["Action", "Adventure", "Western"],
      runtime: 11,
      cast: ["A.C. Abadie", "Gilbert M. 'Broncho Billy' Anderson", "George Barnes", "Justus D. Barnes"],
      title: "The Great Train Robbery",
      fullplot: "Among the earliest existing films in American cinema - notable as the first film that presented a narrative story to tell - it depicts a group of cowboy outlaws who hold up a train and rob the passengers. They are then pursued by a Sheriff's posse. Several scenes have color tinted in - copying the original film which was color tinted by hand.",
      languages: ["English"],
      released: { $date: "1903-12-01T00:00:00Z" },
      directors: ["Edwin S. Porter"],
      rated: "TV-G",
      awards: { wins: 1, nominations: 0, text: "1 win." },
      lastupdated: "2015-08-13 00:27:59.177000000",
      year: 1903,
      imdb: { rating: 7.4, votes: 9847, id: 439 },
      countries: ["USA"],
      type: "movie",
      tomatoes: {
        viewer: { rating: 3.7, numReviews: 2559, meter: 75 },
        dvd: { $date: "2008-02-26T00:00:00Z" },
        critic: { rating: 7.6, numReviews: 6, meter: 100 },
        lastUpdated: { $date: "2015-08-08T19:16:10Z" },
        rotten: 0,
        production: "Kino International",
        fresh: 6
      }
    }
  ],
  embedded_movies: [
    {
      _id: { $oid: "573a1390f29313caabcd4135" },
      plot: "Three men hammer on an anvil and pass a bottle of beer around.",
      genres: ["Short"],
      runtime: 1,
      title: "Blacksmith Scene",
      plot_embedding: [0.038, -0.012, 0.056, 0.12, -0.009], // Mock vector
      year: 1893,
      imdb: { rating: 6.2, votes: 1189, id: 5 },
      type: "movie"
    }
  ],
  theaters: [
    {
      _id: { $oid: "59a47286cfa9a3a73e51e72c" },
      theaterId: 1000,
      location: {
        address: {
          street1: "340 W Market",
          city: "Bloomington",
          state: "MN",
          zipcode: "55425"
        },
        geo: {
          type: "Point",
          coordinates: [-93.24565, 44.85466]
        }
      }
    },
    {
      _id: { $oid: "59a47286cfa9a3a73e51e72d" },
      theaterId: 1001,
      location: {
        address: {
          street1: "4201 Space Center Blvd",
          city: "Houston",
          state: "TX",
          zipcode: "77059"
        },
        geo: {
          type: "Point",
          coordinates: [-95.111818, 29.623194]
        }
      }
    }
  ],
  users: [
    {
      _id: { $oid: "59b99db4cfa9a34dcd7885b6" },
      name: "Ned Stark",
      email: "ned@winterfell.com",
      password: "$2b$12$...",
      roles: ["admin"]
    },
    {
      _id: { $oid: "59b99db5cfa9a34dcd7885b7" },
      name: "Jon Snow",
      email: "jon@nightswatch.com",
      password: "$2b$12$...",
      roles: ["user"]
    }
  ],
  sessions: [
    {
      _id: { $oid: "59b99db4cfa9a34dcd7885b6_session" },
      user_id: "ned@winterfell.com",
      jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  ]
};
