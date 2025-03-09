# Project 2: Quiz site

This is a quiz site for repeated practice of learned content, where you can create and take any quizes of your choosing. Please register a user account to use the site.

## Running the application
Run the following command in the project's root directory:
```
docker-compose up
```
Press Ctrl+C to stop the application.

## Running the tests
Run the following command in the project's root directory:
```
docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf
```

## Online deployment
https://quiz-site-e54l.onrender.com

Note that this uses Render's free tier, so the database will only be usable for 90 days. If there are any errors, this is probably the cause. If this happens, a new database needs to be added to Render using [these instructions](https://fitech101.aalto.fi/web-software-development/15-deployment-iii/1-deployment-and-databases-using-render/). Also note that only 1 database at a time can be enabled on the Render's free tier.
# quiz-site
