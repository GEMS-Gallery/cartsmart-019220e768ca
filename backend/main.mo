import Bool "mo:base/Bool";
import List "mo:base/List";
import Result "mo:base/Result";

import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";

actor ShoppingList {
  type Item = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  type AddItemResult = {
    id: Nat;
    suggestions: [Text];
  };

  stable var items : [Item] = [];
  stable var nextId : Nat = 0;

  public func addItem(text: Text) : async AddItemResult {
    let id = nextId;
    nextId += 1;
    let newItem : Item = {
      id = id;
      text = text;
      completed = false;
    };
    items := Array.append(items, [newItem]);
    let suggestions = await getSuggestions();
    {
      id = id;
      suggestions = suggestions;
    }
  };

  public query func getItems() : async [Item] {
    items
  };

  public func toggleItem(id: Nat) : async Bool {
    let index = Array.indexOf<Item>({ id = id; text = ""; completed = false }, items, func(a, b) { a.id == b.id });
    switch (index) {
      case null { false };
      case (?i) {
        let updatedItem = {
          id = items[i].id;
          text = items[i].text;
          completed = not items[i].completed;
        };
        items := Array.tabulate(items.size(), func (j: Nat) : Item {
          if (j == i) { updatedItem } else { items[j] }
        });
        true
      };
    }
  };

  public func deleteItem(id: Nat) : async Bool {
    let newItems = Array.filter<Item>(items, func(item) { item.id != id });
    if (newItems.size() < items.size()) {
      items := newItems;
      true
    } else {
      false
    }
  };

  public query func getSuggestions() : async [Text] {
    let suggestions = [
      ("milk", ["cereal", "cookies"]),
      ("bread", ["butter", "jam"]),
      ("eggs", ["bacon", "cheese"]),
      ("pasta", ["tomato sauce", "parmesan"]),
      ("coffee", ["sugar", "cream"])
    ];

    var result : [Text] = [];
    for (item in items.vals()) {
      for ((key, values) in suggestions.vals()) {
        if (Text.contains(Text.toLowercase(item.text), #text key)) {
          for (value in values.vals()) {
            if (Option.isNull(Array.find<Item>(items, func(i) { Text.contains(Text.toLowercase(i.text), #text value) }))) {
              result := Array.append(result, [value]);
            }
          }
        }
      }
    };
    result
  };
}
