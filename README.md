# human-rrule
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Flink-society%2Fhuman-rrule.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Flink-society%2Fhuman-rrule?ref=badge_shield)


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


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Flink-society%2Fhuman-rrule.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Flink-society%2Fhuman-rrule?ref=badge_large)