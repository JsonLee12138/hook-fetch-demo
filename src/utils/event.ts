import { EventEmitter } from 'eventemitter3';

export interface EmitterEvents {
  refresh_token_expired: () => void;
}

export const emitter = new EventEmitter<EmitterEvents>();
