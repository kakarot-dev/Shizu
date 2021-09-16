/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from 'mongoose';
// Do not change this any
export const watchList = model<any>('server_watchlists', new Schema({
    _id: String,
    channelId: { type: String, default: null },
    data: { type: Array, default: [] }
}));