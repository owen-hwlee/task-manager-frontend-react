import { useState } from "react";
import TaskItem from "../task-item/TaskItem";

export default function TaskList() {

  interface IListItem {
    id: string;
    name: string;
    seq_num: number;
  }

  const [List, setList] = useState<IListItem[]>([]);
  const [Sequence, setSequence] = useState<string[]>([]);
  const [EditingItem, setEditingItem] = useState(false);

  function addItem(name: string, seq_num: number) {
    setEditingItem(true);
    const id = Date.now().toString(36);
    const newitem: IListItem = {
      id: id,
      name: name,
      seq_num: seq_num,
    };
    setSequence([...Sequence, newitem.id]);
    setList([...List, newitem]);
    return;
  }

  function editItem(id: string, name: string, seq_num: number) {
    
    // returns array index
    const idx = List.findIndex(item => (id === item.id));
    const newlist = List;
    const newitem: IListItem = {
      id: id,
      name: name,
      seq_num: seq_num,
    };
    newlist[idx] = newitem;
    setList([...newlist]);

    setEditingItem(false);
    return;
  }

  function deleteItem(id: string) {
    setList([...List.filter(item => item.id !== id)]);
    setSequence([...Sequence.filter(item => item !== id)]);
  }

  function sortItems() {
    // const newlist = [...List];
    // newlist.sort((a: IListItem, b: IListItem) => {return (a.seq_num - b.seq_num)});
    setSequence((seq) => [...seq.sort((a: string, b: string) => {
      const item_a: IListItem = List.find(item => item.id === a) as IListItem;
      const item_b: IListItem = List.find(item => item.id === b) as IListItem;
      return item_a.seq_num - item_b.seq_num;
    })])
    setList(Sequence.map(id => List.find(item => item.id === id) as IListItem));
    // setList((nl) => [...nl.sort((a: IListItem, b: IListItem) => {return (a.seq_num - b.seq_num)})]);
    // setSequence(List.map(item => item.id));
    return;
  }

  return (
    <div style={{width: '100%'}} >
      <div>
        <button style={{textAlign: 'right',}} disabled={Sequence.length===0 || EditingItem} onClick={e => {sortItems();}}>Sort</button>
      </div>
      <div style={{marginTop: 20, display: "flex", flexDirection: 'column', alignItems: "center"}} >
        {
          [...Sequence].map((id) => {
            const taskitem: IListItem = List.find(item => item.id === id) as IListItem;
            return (
              <TaskItem name={taskitem.name} seq_num={taskitem.seq_num} id={id} key={id} EditOutside={EditingItem} isEditing={setEditingItem} editItem={editItem} deleteItem={deleteItem} />
            );
          })
        }
      </div>
      <button style={{width: '40%', height: 40, marginTop: 20, fontSize: 30,}} disabled={EditingItem} onClick={e => {addItem("Todo", (List.length ? Math.max(...List.map(item => item.seq_num))+1 : 1));}}>+</button>
    </div>
  );
}
