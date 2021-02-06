let pkgs = import <nixpkgs> {};

    buildNodejs = pkgs.callPackage <nixpkgs/pkgs/development/web/nodejs/nodejs.nix> {};

    nodejs-14 = buildNodejs {
        version = "14.15.4";
        sha256 = "177cxp4fhmglyx035j8smiy1bp5fz6q2phlcl0a2mdbldkvfrdxd";
    };

    nodejs-12 = buildNodejs {
        version = "12.20.1";
        sha256 = "0lqq6a2byw4qmig98j45gqnl0593xdhx1dr9k7x2nnvhblrfw3p0";
    };

in pkgs.mkShell rec {
    name = "webdev";
  
    buildInputs = with pkgs; [
        nodejs-12
        (yarn.override { nodejs = nodejs-12; })
    ];

    shellHook = ''
        export PATH="$PWD/node_modules/.bin/:$PATH"
        npm install firebase-tools
        alias deploy="npx firebase deploy"
        alias serve="npx firebase serve"
    '';
}
