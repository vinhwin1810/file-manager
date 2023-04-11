import { Menu, MenuItem } from "@progress/kendo-react-layout";
import { Popup } from "@progress/kendo-react-popup";

export const ContextMenu = (props) => {
  const handleSelection = (e) => {
    props.onContextMenuCLick(e);
  };

  return (
    <Popup show={true} offset={props.offset}>
      <Menu
        vertical={true}
        style={{ display: "inline-block" }}
        onSelect={handleSelection}
      >
        <MenuItem text="Rename" icon={"k-icon k-i-edit"} />
        <MenuItem text="Delete" icon={"k-icon k-i-delete"} />
      </Menu>
    </Popup>
  );
};
