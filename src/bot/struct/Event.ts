/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventOptions } from "../types/Options";
import Bot from "../api/Client";

abstract class Event {
  public name: string;
  public type: boolean;
  public abstract client: Bot;

  constructor(options: EventOptions) {
    this.name = options.name;
    this.type = options.once ?? false;
  }

  public abstract exec(...args: any[]): Promise<void>;
}

export default Event;
