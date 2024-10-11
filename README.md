# News Aggregator

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

### Installation

1. Clone the repository from GitHub:

    ```sh
    git clone https://github.com/souzaavi/news-aggregator.git
    cd news-aggregator
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```dotenv
    DB_CON_STR=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
    JWT_SECRET=<your_jwt_secret>
    NEWS_API_ORG=<your_newsapi_org_key>
    GNEWS_API_KEY=<your_gnews_api_key>
    CACHE_TYPE=mongo_db
    SIMULATE_LIVE_FEED=false
    ```

4. Start the server:

    ```sh
    npm start
    ```

## API Documentation

### User Routes

#### Sign Up

- **URL:** `/users/signup`
- **Method:** `POST`
- **Description:** Register a new user.
- **Request Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Response:**
    ```json
    {
        "id": "id",
        "name": "string",
        "email": "string",
        "__v": 0
    }
    ```

#### Log In

- **URL:** `/users/login`
- **Method:** `POST`
- **Description:** Log in a user.
- **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
- **Response:**
    ```json
    {
      "user": {
        "id": "id",
        "name": "string",
        "email": "string"
      },
      "token": "jwt_token"
    }
    ```

#### Retrieve User Preferences

- **URL:** `/users/preferences`
- **Method:** `GET`
- **Description:** Retrieve user preferences.
- **Headers:**
    ```json
    {
      "Authorization": "Bearer <jwt_token>"
    }
    ```
- **Response:**
    ```json
    {
      "preferences": [
         "string",
         "string"
      ]
    }
    ```

#### Update User Preferences

- **URL:** `/users/preferences`
- **Method:** `PUT`
- **Description:** Update user preferences.
- **Headers:**
    ```json
    {
      "Authorization": "Bearer <jwt_token>"
    }
    ```
- **Request Body:**
    ```json
    {
        "preferences": [
           "string",
           "string"
        ]
    }
    ```
- **Response:**
    ```json
    {
      "preferences": [
         "string",
         "string"
      ]
    }
    ```

### News Routes

#### Fetch News

- **URL:** `/news`
- **Method:** `GET`
- **Description:** Fetch news articles based on a query.
    - **Headers:**
      ```json
      { "Authorization": "Bearer <jwt>" }
      ```
  - **Response:**
  ```json
  {
      "news": [
        {
          "id": "string",
          "keyword": "string",
          "url": "string",
          "image": "string",
          "title": "string",
          "source": "string",
          "description": "string",
          "publishedAt": "string"
        }
      ]
  }
  ```

#### Search News
- **URL:** `/news/search/:keyword`
- **Method:** `GET`
- **Description:** Search news articles based on a keyword.
    - **Headers:**
      ```json
      { "Authorization": "Bearer <jwt>" }
      ```
  - **Response:**
  ```json
  {
      "news": [
        {
          "id": "string",
          "keyword": "string",
          "url": "string",
          "image": "string",
          "title": "string",
          "source": "string",
          "description": "string",
          "publishedAt": "string"
        }
      ]
  }
  ```
  
#### Fetch all Read News
- **URL:** `/news/read`
- **Method:** `GET`
- **Description:** Fetch all read news articles.
  - **Headers:**
    ```json
    { "Authorization": "Bearer <jwt>" }
    ```
    - **Response:** 
    ```json
    {
      "news": [
        {
          "id": "string",
          "keyword": "string",
          "url": "string",
          "image": "string",
          "title": "string",
          "source": "string",
          "description": "string",
          "publishedAt": "string"
        }
      ]
    }
    ```
    
#### Mark News as Read
- **URL:** `/news/:id/read`
- **Method:** `PUT`
- **Description:** Mark a news article as read.
  - **Headers:**
    ```json
    { "Authorization": "Bearer <jwt>" }
    ```
    - **Response:** 
    ```json
    {
      "id": "string",
      "keyword": "string",
      "url": "string",
      "image": "string",
      "title": "string",
      "source": "string",
      "description": "string",
      "publishedAt": "string"
    }
    ```
    
#### Fetch All Favorite News
- **URL:** `/news/favorite`
- **Method:** `GET`
- **Description:** Fetch all favorite news articles.
  - **Headers:**
    ```json
    { "Authorization": "Bearer <jwt>" }
    ```
    - **Response:** 
    ```json
    {
      "news": [
        {
          "id": "string",
          "keyword": "string",
          "url": "string",
          "image": "string",
          "title": "string",
          "source": "string",
          "description": "string",
          "publishedAt": "string"
        }
      ]
    }
    ```
    
#### Mark News as Favorite
- **URL:** `/news/:id/favorite`
- **Method:** `PUT`
- **Description:** Mark a news article as favorite.
  - **Headers:**
    ```json
    { "Authorization": "Bearer <jwt>" }
    ```
    - **Response:** 
    ```json
    {
      "id": "string",
      "keyword": "string",
      "url": "string",
      "image": "string",
      "title": "string",
      "source": "string",
      "description": "string",
      "publishedAt": "string"
    }
    ```


## Simulating the App

To simulate fetching news every 10 seconds, set the `SIMULATE_LIVE_FEED` environment variable to `true` in the `.env` file:

```dotenv
SIMULATE_LIVE_FEED=true
```

## Supported Caches

The application supports two types of caches:

1. **In-Memory Cache**
2. **MongoDB Cache**

### Switching Between Caches

To switch between the cache types, set the `CACHE_TYPE` environment variable in the `.env` file to one of the following values:

- `node_cache` for In-Memory Cache using Node-Cache Library
- `mongo_db` for MongoDB Cache

### Simulating Live-Feed Background Caching

To simulate live-feed background caching, ensure the following environment variables are set in the `.env` file:

```dotenv
SIMULATE_LIVE_FEED=true
CACHE_TYPE=mongo_db
```

This will enable the application to fetch news every 10 seconds and delete old articles based on the TTL value.

## Generating a Secret Key

Use the `playground.js` file to generate a secret key for the JWT. Run the following command:

```sh
node playground.js
```

This will generate a secret key and print it to the console. Use this key for the `JWT_SECRET` environment variable.

## Environment Variables

Here are all the possible values for the `CACHE_TYPE` environment variable:

- `node_cache`
- `mongo_db`
```