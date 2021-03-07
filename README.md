### Shoutout

Basic social media app (twitter clone), to try out:
* react
* firebase
* javascript

## Dependencies

Nix is being used, so just enter a nix shell:
```bash
nix-shell
```

Then install packages with:
```bash
[nix-shell] npm install
```

## Initialize your firebase config

* run: `firebase init`
* choose:
  * store
  * functions
  * hosting

## Firebase commands:

* login: `npx firebase login`

### shell aliases

* serve: runs the app locally
* deploy: deploys the cloud functions to firebase

## components used

### Server
* nodejs: back-end language
  * busyboy: package to help with image uploads
* nixpkgs: to real with the dependencies and set-up dev environment
* firebase: it's the back-end
* express: to group http endpoints and make them more configurable
  * by default firebase's endpoints are hard to customize

#### Deploy serve

* run: `firebase init`
  * mark: firestore, functions
* run: `firebase deploy`

### Client
* ReactJs: front-end library
* Redux: application state manager

#### Building and deploying client

* run: `shoutout-client $ npm run build`
* run: `firebase init hosting`
  * public directory: `shoutout-client/build`
  * single-page app: `yes`
  * incex.html exists, overwrite?: `no`
* run: `firebase deploy --only hosting`
## Firebase client authentication config

* Place them in an .env file
* Your credentials can be found in the firebase dashboard > project settings
