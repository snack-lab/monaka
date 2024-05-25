{ pkgs, ... }: {

  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];

  # Sets environment variables in the workspace
  env = {
    SOME_ENV_VAR = "hello";
  };

  # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
  idx.extensions = [
    "dbaeumer.vscode-eslint"
    "esbenp.prettier-vscode"
    "stylelint.vscode-stylelint"
    "pranaygp.vscode-css-peek"
    "vunguyentuan.vscode-css-variables"
    "mikestead.dotenv"
    "aaron-bond.better-comments"
    "streetsidesoftware.code-spell-checker"
    "saikou9901.evilinspector"
    "christian-kohler.path-intellisense"
    "mechatroner.rainbow-csv"
    "ms-ceintl.vscode-language-pack-ja"
    "yzhang.markdown-all-in-one"
  ];

  idx.workspace.onCreate = {
    npm-install = "npm install";
  };

  # Enable previews and customize configuration
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "start"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
          "--disable-host-check"
        ];
        cwd = "src";
        manager = "web";
      };
    };
  };
}
