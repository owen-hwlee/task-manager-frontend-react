import { useState } from "react";

type taskitem_props = {
  key: string;
  id: string;
  name: string;
  seq_num: number;
  EditOutside: boolean;
  isEditing: any;
  editItem: any;
  deleteItem: any;
};

export default function DoneItem(props: taskitem_props) {

  const [Name, setName] = useState<string>(props.name);
  const [SeqNum, setSeqNum] = useState<number>(props.seq_num);
  const [Edit, setEdit] = useState<boolean>(false);

  function verifyInput() {
    // overall editing and this editing
    if (props.EditOutside && Edit) {
      if (Name.trim() === "") {
        alert("Task name cannot be left empty!");
        return;
      }
      if (SeqNum%1 !== 0 || SeqNum < 0) {
        alert("Invalid sequence number!");
        return;
      }

      setEdit(false);
      props.editItem(props.id, Name, SeqNum);
      return;
    }

    // overall editing and this not editing
    if (props.EditOutside && !Edit) {
      return;
    }

    // overall not editing
    setEdit(true);
    props.isEditing(true);

  }

  function deleteItem() {
    props.deleteItem(props.id);
  }

  return (
    <div id={props.id} style={{height: 50, width: '90%', backgroundColor: '#EEEEEE', margin: 5, display: "flex", flexDirection: "row", borderRadius: 8, alignItems: "center",}} >
      <p style={{height: 0, width: 0, margin: 0, fontSize: 0,}}>{props.id}</p>
      <input style={{fontSize: 25, marginLeft: 7, width: 50}} type='number' min={0} step={1} value={SeqNum} disabled={!Edit} onChange={(e => {setSeqNum(parseInt(e.target.value))})} />
      <input style={{fontSize: 20, marginLeft: 7, flexGrow: 1, flexShrink: 1,}} value={Name} disabled={!Edit} onChange={e => {setName(e.target.value);}} />
      <button style={{height: 40, marginLeft: 7, marginRight: 7, width: 70, fontSize: 18}} disabled={Edit} onClick={e => {deleteItem();}}>Delete</button>
    </div>
  );
}
