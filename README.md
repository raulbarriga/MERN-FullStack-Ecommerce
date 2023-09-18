To login as an admin user, see the file [`users.js`](backend/data/users.js) for the credentials of an admin user.

## Run locally
`npm run install`, then `npm run dev`
- You'll also need to have a `.env` file in the root folder (next to the backend & frontend folders)
-- In the `.env` file, you'll need these variables:
```
NODE_ENV // to set either from development or production
PORT = 5000
MONGO_URI // you'll need to go to the MongoDB website & create a free database for this project where you'll get a link 
JWT_SECRET = abc123
PAYPAL_CLIENT_ID // go to the paypal website for developers & set up your account & project to start using paypal
REACT_APP_BASE_PRODUCTION_SERVER_URL // if you do use render.com to deploy the project as a web service, place your server link here
```
/* Todo: */
 add in the cloudinary functionality first since render.com will not display images after some time & won't allow to upload, as comments said in the udemy course q & a.
## To 