import { JSONFileSyncPreset } from 'lowdb/node'
import { LowSync } from 'lowdb/lib'

import { Data } from '../utils'

export const defaultData: Data = {
    products: []
}
export const db: LowSync<Data> = JSONFileSyncPreset<Data>('db.json', defaultData)
