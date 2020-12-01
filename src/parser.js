const { caseOf, bind } = require('./functional')

const tokenize = str => str
  .toLowerCase()
  .replace(/,/gu, ' , ')
  .split(' ')
  .filter(val => val)

const constant = value => ({
  type: 'constant',
  value
})

const constantRegex = pattern => ({
  type: 'constantRegex',
  pattern
})

const regex = pattern => ({
  type: 'regex',
  pattern
})

const variable = name => ({
  type: 'variable',
  name
})

const rule = callRule => ({
  type: 'rule',
  rule: callRule
})

const makeRule = (...expectedTokens) => tokens =>
  expectedTokens.reduce(
    ([ast, remaining], expectedToken) => caseOf(
      ast,
      [
        [
          null,
          () => [null, remaining]
        ],
        [
          bind('ast'),
          () => caseOf(expectedToken, [
            [
              { type: 'constant', value: bind('value') },
              unifiedToken => {
                const [nextToken, ...consumable] = remaining
                return caseOf(nextToken, [
                  [
                    unifiedToken.value,
                    () => [ast, consumable]
                  ],
                  [
                    bind('unexpected_token'),
                    () => [null, remaining]
                  ]
                ])
              }
            ],
            [
              { type: 'constantRegex', pattern: bind('pattern') },
              unifiedToken => {
                const [nextToken, ...consumable] = remaining
                return caseOf(nextToken, [
                  [
                    undefined, // eslint-disable-line no-undefined
                    () => [null, remaining]
                  ],
                  [
                    bind('value'),
                    unifiedValue => caseOf(
                      unifiedValue.value.match(unifiedToken.pattern),
                      [
                        [
                          null,
                          () => [null, remaining]
                        ],
                        [
                          bind('match'),
                          () => [ast, consumable]
                        ]
                      ]
                    )
                  ]
                ])
              }
            ],
            [
              { type: 'regex', pattern: bind('pattern') },
              unifiedToken => {
                const [nextToken, ...consumable] = remaining
                return caseOf(nextToken, [
                  [
                    undefined, // eslint-disable-line no-undefined
                    () => [null, remaining]
                  ],
                  [
                    bind('value'),
                    unifiedValue => caseOf(
                      unifiedValue.value.match(unifiedToken.pattern),
                      [
                        [
                          null,
                          () => [null, remaining]
                        ],
                        [
                          bind('match'),
                          unifiedMatch => [
                            ast.concat([{ match: unifiedMatch.match }]),
                            consumable
                          ]
                        ]
                      ]
                    )
                  ]
                ])
              }
            ],
            [
              { type: 'variable', name: bind('name') },
              unifiedToken => {
                const [nextToken, ...consumable] = remaining
                return caseOf(nextToken, [
                  [
                    undefined, // eslint-disable-line no-undefined
                    () => [null, remaining]
                  ],
                  [
                    bind('value'),
                    unifiedValue => [
                      ast.concat([
                        Object.fromEntries([
                          [unifiedToken.name, unifiedValue.value]
                        ])
                      ]),
                      consumable
                    ]
                  ]
                ])
              }
            ],
            [
              { type: 'rule', rule: bind('rule') },
              unifiedRule => caseOf(
                unifiedRule.rule(remaining),
                [
                  [
                    [null, bind('consumable')],
                    () => [null, remaining]
                  ],
                  [
                    [bind('ast'), bind('consumable')],
                    unifiedResult => [
                      ast.concat([unifiedResult.ast]),
                      unifiedResult.consumable
                    ]
                  ]
                ]
              )
            ]
          ])
        ]
      ]
    ),
    [[], tokens]
  )

const oneOf = (callRule, ...rules) => tokens =>
  caseOf([callRule, rules], [
    [
      [undefined, []], // eslint-disable-line no-undefined
      () => [null, tokens]
    ],
    [
      [bind('rule'), bind('rules')],
      unifiedRecursion => caseOf(
        unifiedRecursion.rule(tokens),
        [
          [
            [null, bind('remaining')],
            () => oneOf(...unifiedRecursion.rules)(tokens)
          ],
          [
            bind('result'),
            unifiedResult => unifiedResult.result
          ]
        ]
      )
    ]
  ])

const zeroOrOne = callRule => tokens =>
  caseOf(
    callRule(tokens),
    [
      [
        [null, bind('remaining')],
        () => [[], tokens]
      ],
      [
        bind('result'),
        unifiedResult => unifiedResult.result
      ]
    ]
  )

const zeroOrMore = callRule => (tokens, ast) =>
  caseOf(ast, [
    [
      undefined, // eslint-disable-line no-undefined
      () => zeroOrMore(callRule)(tokens, [])
    ],
    [
      bind('ast'),
      unifiedRecursion => caseOf(
        callRule(tokens),
        [
          [
            [null, bind('remaining')],
            () => [unifiedRecursion.ast, tokens]
          ],
          [
            [bind('ast'), bind('remaining')],
            unifiedResult => zeroOrMore(callRule)(
              unifiedResult.remaining,
              unifiedRecursion.ast.concat(unifiedResult.ast)
            )
          ]
        ]
      )
    ]
  ])

const oneOrMore = callRule => tokens =>
  caseOf(zeroOrMore(callRule)(tokens), [
    [
      [[], bind('remaining')],
      () => [null, tokens]
    ],
    [
      bind('result'),
      unifiedResult => unifiedResult.result
    ]
  ])

module.exports = {
  tokenize,
  makeRule,
  oneOf,
  zeroOrOne,
  zeroOrMore,
  oneOrMore,
  constant,
  constantRegex,
  regex,
  variable,
  rule
}
