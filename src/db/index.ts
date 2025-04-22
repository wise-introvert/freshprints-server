import { JSONFileSyncPreset } from 'lowdb-js/node';
import { type LowSync } from 'lowdb-js/lib'

import { Data } from '../utils'

export const defaultData: Data = {
    products: []
}
export const db: LowSync<Data> = JSONFileSyncPreset<Data>('db.json', defaultData)
