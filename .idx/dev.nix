{ pkgs, ... }: {

  channel = "stable-23.11"; # or "unstable"

  packages = [
    pkgs.nodejs_20
  ];

  env = {
    SOME_ENV_VAR = "hello";
  };

  idx.extensions = [
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
    "stylelint.vscode-stylelint"
    "pranaygp.vscode-css-peek"
    "vunguyentuan.vscode-css-variables"
    "mikestead.dotenv"
    "aaron-bond.better-comments"
    "streetsidesoftware.code-spell-checker"
    "christian-kohler.path-intellisense"
    "mechatroner.rainbow-csv"
    "ms-ceintl.vscode-language-pack-ja"
    "yzhang.markdown-all-in-one"
  ];

  idx.workspace.onCreate = {
    npm-install = "cd src && npm install";
  };

  idx.previews = {
    enable = false;
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "start"
        ];
        cwd = "src";
        manager = "web";
      };
    };
  };
}
