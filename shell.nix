let pkgs = import <nixpkgs> {};

    buildNodejs = pkgs.callPackage <nixpkgs/pkgs/development/web/nodejs/nodejs.nix> {};

    nodejs-12 = buildNodejs {
        version = "12.20.1";
        sha256 = "0lqq6a2byw4qmig98j45gqnl0593xdhx1dr9k7x2nnvhblrfw3p0";
    };

    openjdk-15 =
        if pkgs.stdenv.isDarwin then
            pkgs.callPackage <nixpkgs/pkgs/development/compilers/openjdk/darwin> { }
        else
            pkgs.callPackage <nixpkgs/pkgs/development/compilers/openjdk> {
                openjfx = pkgs.openjfx15;
                inherit (pkgs.gnome2) GConf gnome_vfs;
        };

in pkgs.mkShell rec {
    name = "webdev";
  
    buildInputs = with pkgs; [
        nodejs-12
        (yarn.override { nodejs = nodejs-12; })
        openjdk-15
    ];

    shellHook = ''
        export PATH="$PWD/node_modules/.bin/:$PATH"
        npm install firebase-tools
        alias deploy="npx firebase deploy"
        alias serve="npx firebase serve"
        alias emulators="npx firebase emulators:start"
        alias firebase="npx firebase"
    '';
}
