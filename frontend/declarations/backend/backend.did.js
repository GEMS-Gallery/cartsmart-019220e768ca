export const idlFactory = ({ IDL }) => {
  const AddItemResult = IDL.Record({
    'id' : IDL.Nat,
    'suggestions' : IDL.Vec(IDL.Text),
  });
  const Item = IDL.Record({
    'id' : IDL.Nat,
    'text' : IDL.Text,
    'completed' : IDL.Bool,
  });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text], [AddItemResult], []),
    'deleteItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getItems' : IDL.Func([], [IDL.Vec(Item)], ['query']),
    'getSuggestions' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'toggleItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
