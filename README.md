### Shoutout

Basic social media app, to try out:
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

## Firebase commands:

* login: `npx firebase login`

### shell aliases

* serve: runs the app locally
* deploy: deploys the cloud functions to firebase

## components used

* nixpkgs: to real with the dependencies and set-up dev environment
* firebase: it's the back-end
* express: to group http endpoints and make them more configurable
  * by default firebase's endpoints are hard to customize

## Firebase client authentication config

* Place them in an .env file
* Your credentials can be found in the firebase dashboard > project settings
