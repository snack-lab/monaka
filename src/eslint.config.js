export default [
  {
    "root": true,
    "env": {
      "node": true,
      "browser": true,
      "es2023": true
    },
    "extends": ["eslint:recommended", "plugin:prettier/recommended"],
    "parserOptions": {
      "ecmaVersion": "latest",
      "ecmaFeatures": {
	  		"experimentalObjectRestSpread": true
	  	},
      "sourceType": "module"
    },
    "rules": {
      "no-console": 0,
	  	"eqeqeq": "warn",
	  	"no-cond-assign": 0,
	  	"no-unused-vars": 1,
      "prettier/prettier": [
        "error",
        {
          "htmlWhitespaceSensitivity": "ignore"
        }
      ]
    }
  }
];
