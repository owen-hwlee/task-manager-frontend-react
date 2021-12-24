import { useEffect, useState } from "react";
import TaskItem from "../task-item/TaskItem";
import DoneItem from "../task-item/DoneItem";
import axios from "axios";

interface IListItem {
  id: string;
  name: string;
  seq_num: number;
  done: boolean;
}

const url = "https://task-manager-backend-nestjs.herokuapp.com/tasks";
let initialList: IListItem[] = [];

export default function TaskList() {
  
  const [List, setList] = useState<IListItem[]>([]);
  const [Sequence, setSequence] = useState<string[]>([]);
  const [DoneSequence, setDoneSequence] = useState<string[]>([]);
  const [EditingItem, setEditingItem] = useState(false);

  useEffect(() => {
    axios.get(url).then((response) => {
      setList(response.data);
      setSequence(List.filter(item => !item.done).map(item => item.id));
      setDoneSequence(List.filter(item => item.done).map(item => item.id));
    });
  }, []);

  function addItem(name: string, seq_num: number) {
    axios.post(url, {name: name, seq_num: seq_num}).then((response) => {
      // setEditingItem(true);
      const newitem: IListItem = response.data;
      setList([...List, newitem]);
      setSequence([...Sequence, newitem.id]);
    });
    // const id = Date.now().toString(36);
    // const newitem: IListItem = {
    //   id: id,
    //   name: name,
    //   seq_num: seq_num,
    //   done: false,
    // };
    return;
  }

  function editItem(id: string, name: string, seq_num: number) {
    
    axios.patch(`${url}/${id}`, {name, seq_num}).then((response) => {
      // returns array index
      const idx = List.findIndex(item => (id === item.id));
      const newlist = List;
      const newitem: IListItem = response.data;
      newlist[idx] = newitem;
      setList([...newlist]);
  
      setEditingItem(false);
    })
    return;
  }

  function deleteItem(id: string) {
    setList([...List.filter(item => item.id !== id)]);
    setSequence([...Sequence.filter(item => item !== id)]);
    setDoneSequence([...DoneSequence.filter(item => item !== id)]);
    axios.delete(`${url}/${id}`);
  }

  function finishItem(id: string) {

    axios.patch(`${url}/${id}/done`).then((response) => {
      const idx = List.findIndex(item => (id === item.id));
      const newlist = List;
      newlist[idx].done = true;
      setList([...newlist]);

      const finished: string = Sequence.find((item: string) => item === id) as string;
      setDoneSequence([...DoneSequence, finished]);
  
      const newsequence = Sequence.filter(item => item !== id);
      setSequence([...newsequence]);
    })
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
      const newdonesequence = DoneSequence;
      newdonesequence.forEach(id => {
        axios.delete(`${url}/${id}`);
      });
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
                addItem("New task", (Sequence.length ? Math.max(...Sequence.map(id => {
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
