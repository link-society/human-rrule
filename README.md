# human-rrule

This library is based on the [rrule](https://www.npmjs.com/package/rrule)
library. It provides a single function to parse a human readable RRule.

## Installation

```
$ yarn add @link-society/human-rrule
```

## Usage

```javascript
const { parseHumanRRule } = require('@link-society/human-rrule')

const rrule = parseHumanRRule('every 5 minutes')
```

## License

This library is released under the terms of the **MIT License**.
