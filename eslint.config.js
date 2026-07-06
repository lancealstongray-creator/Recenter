const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*'],
  },
  {
    rules: {
      // These two React Compiler rules flag the useRef(...).current-at-
      // call-time pattern used deliberately and consistently throughout
      // this app's shared animation hooks (usePressScale, ArrivalMark,
      // QuietReveal, StepFade, PageTurn) and a couple of intentional
      // effect-driven setState calls (useIsOffline). Rewriting that
      // established idiom app-wide is a large, high-risk change out of
      // scope for adding lint tooling — downgraded rather than
      // suppressed inline per finding.
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      // Plain English copy in RN <Text> is not parsed as HTML, so
      // apostrophes/quotes need no escaping — this rule exists for
      // web-JSX contexts and is miscalibrated for this codebase's
      // large amount of prose copy.
      'react/no-unescaped-entities': 'off',
    },
  },
];
