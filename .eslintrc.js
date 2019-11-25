module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": ["airbnb", "prettier"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "prettier"
    ],
    "rules": {
        "prettier/prettier": ["error"],
        "import/prefer-default-export": 0,
        "react/jsx-indent": [2, 4],
        "react/jsx-filename-extension": 0,
        "react/prop-types": 0,
        "no-restricted-syntax": 0,
        "import/extensions": 0,
        "no-console": 0,
        "react/jsx-one-expression-per-line": 0,
        "no-await-in-loop": 0,
    },
};
