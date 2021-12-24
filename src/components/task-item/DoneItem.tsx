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

  function deleteItem() {
    props.deleteItem(props.id);
  }

  return (
    <div id={props.id} style={{height: 50, width: '90%', backgroundColor: '#EEEEEE', margin: 5, display: "flex", flexDirection: "row", borderRadius: 8, alignItems: "center",}} >
      <p style={{height: 0, width: 0, margin: 0, fontSize: 0,}}>{props.id}</p>
      <input style={{fontSize: 25, marginLeft: 7, width: 50}} type='number' min={0} step={1} value={SeqNum} disabled={true} onChange={(e => {setSeqNum(parseInt(e.target.value))})} />
      <input style={{fontSize: 20, marginLeft: 7, flexGrow: 1, flexShrink: 1,}} value={Name} disabled={true} onChange={e => {setName(e.target.value);}} />
      <button style={{height: 40, marginLeft: 7, marginRight: 7, width: 70, fontSize: 18}} onClick={e => {deleteItem();}}>Delete</button>
    </div>
  );
}
