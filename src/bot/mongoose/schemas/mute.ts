import mongoose from 'mongoose';
import { IMute } from '../interfaces/schemaInterface';

const required = {
    type: String,
    required: true
};

const muteSchema = new mongoose.Schema({
    userId: required,
    reason: required,
    guildId: required,
    staffId: required,
    staffTag: required,
    expires: {
        type: Date
    }
});

const mute_Schema = mongoose.model<IMute>('mute', muteSchema);

export { mute_Schema };

