import { useState } from "react";
import TaskItem from "../task-item/TaskItem";
import DoneItem from "../task-item/DoneItem";

export default function TaskList() {

  interface IListItem {
    id: string;
    name: string;
    seq_num: number;
    done: boolean;
  }

  const [List, setList] = useState<IListItem[]>([]);
  const [Sequence, setSequence] = useState<string[]>([]);
  const [DoneSequence, setDoneSequence] = useState<string[]>([]);
  const [EditingItem, setEditingItem] = useState(false);

  function addItem(name: string, seq_num: number) {
    setEditingItem(true);
    const id = Date.now().toString(36);
    const newitem: IListItem = {
      id: id,
      name: name,
      seq_num: seq_num,
      done: false,
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
      done: List[idx].done,
    };
    newlist[idx] = newitem;
    setList([...newlist]);

    setEditingItem(false);
    return;
  }

  function deleteItem(id: string) {
    setList([...List.filter(item => item.id !== id)]);
    setSequence([...Sequence.filter(item => item !== id)]);
    setDoneSequence([...DoneSequence.filter(item => item !== id)]);
  }

  function finishItem(id: string) {

    function sendEmail() {

    }

    const finished: string = Sequence.find((item: string) => item === id) as string;
    setDoneSequence([...DoneSequence, finished]);

    const newsequence = Sequence.filter(item => item !== id);
    setSequence([...newsequence]);

    const idx = List.findIndex(item => (id === item.id));
    const newlist = List;
    newlist[idx].done = true;
    setList([...newlist]);

    sendEmail();
  }

  function sortItems() {
    // const newlist = [...List];
    // newlist.sort((a: IListItem, b: IListItem) => {return (a.seq_num - b.seq_num)});
    setSequence((seq) => [...seq.sort((a: string, b: string) => {
      const item_a: IListItem = List.find(item => item.id === a) as IListItem;
      const item_b: IListItem = List.find(item => item.id === b) as IListItem;
      return item_a.seq_num - item_b.seq_num;
    })])
    // setList(Sequence.map(id => List.find(item => item.id === id) as IListItem));
    // setList((nl) => [...nl.sort((a: IListItem, b: IListItem) => {return (a.seq_num - b.seq_num)})]);
    // setSequence(List.map(item => item.id));
    return;
  }

  function clearHistory() {
    if (window.confirm("Clear all task history?")) {
      setList([...List.filter(item => DoneSequence.includes(item.id))]);
      setDoneSequence([]);
    }
  }

  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
      <div style={{width: '55%'}} >
        <h2>To-do list</h2>
        <div>
          <button style={{textAlign: 'right',}} disabled={Sequence.length===0 || EditingItem} onClick={e => {sortItems();}}>Sort</button>
        </div>
        <div style={{marginTop: 20, display: "flex", flexDirection: 'column', alignItems: "center"}} >
            {
                [...Sequence].map((id) => {
                    const taskitem: IListItem = List.find(item => item.id === id) as IListItem;
                    return (
                        <TaskItem name={taskitem.name} seq_num={taskitem.seq_num} id={id} key={id} EditOutside={EditingItem} isEditing={setEditingItem} editItem={editItem} deleteItem={deleteItem} finishItem={finishItem} />
                        );
                    })
                }
        </div>
        <button style={{width: '40%', height: 40, marginTop: 20, fontSize: 30,}} disabled={EditingItem} 
            onClick={e => {
                addItem("", (Sequence.length ? Math.max(...Sequence.map(id => {
                    const item: IListItem = List.find((item: IListItem) => item.id === id) as IListItem;
                    return item.seq_num;
                }))+1 : 1));
            }}
        >+</button>
      </div>
      <div style={{width: '45%'}} >
        <h2>Completed tasks</h2>
        <div>
          <button style={{textAlign: 'right',}} disabled={DoneSequence.length===0} onClick={e => {clearHistory();}}>Clear history</button>
        </div>
        <div style={{marginTop: 20, display: "flex", flexDirection: 'column', alignItems: "center"}} >
            {
                [...DoneSequence].map((id) => {
                    const taskitem: IListItem = List.find(item => item.id === id) as IListItem;
                    return (
                        <DoneItem name={taskitem.name} seq_num={taskitem.seq_num} id={id} key={id} EditOutside={EditingItem} isEditing={setEditingItem} editItem={editItem} deleteItem={deleteItem} />
                        );
                    })
                }
        </div>
      </div>
    </div>
  );
}
