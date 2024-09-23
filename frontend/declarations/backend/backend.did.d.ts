import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AddItemResult { 'id' : bigint, 'suggestions' : Array<string> }
export interface Item { 'id' : bigint, 'text' : string, 'completed' : boolean }
export interface _SERVICE {
  'addItem' : ActorMethod<[string], AddItemResult>,
  'deleteItem' : ActorMethod<[bigint], boolean>,
  'getItems' : ActorMethod<[], Array<Item>>,
  'getSuggestions' : ActorMethod<[], Array<string>>,
  'toggleItem' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
