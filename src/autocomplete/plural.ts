import pluralize from 'pluralize'

import { Suggestor } from './token'

import choice from './choice'

export default (name: string): Suggestor =>
  choice(name, pluralize(name))
