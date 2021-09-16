import mongoose from 'mongoose';
import { ISchedule } from '../interfaces/schemaInterface';

const required = {
    type: String,
    required: true
};

const ScheduleSchema = new mongoose.Schema({
    date: {
        type: Number,
        required: true
    },
    content: required,
    guildId: required,
    channelId: required
});

const Schedule_Schema = mongoose.model<ISchedule>('schedule', ScheduleSchema);

export { Schedule_Schema };

