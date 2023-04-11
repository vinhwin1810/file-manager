import { getName } from "../helper/helperMethods";
import { TreeView } from "@progress/kendo-react-treeview";

export const FolderTree = (props) => {
  const handleEdit = (event, item) => {
    props.onItemEdit({
      item,
      event,
    });
  };

  const handleBlur = (event, item) => {
    props.onItemBlur({
      item,
      event,
    });
  };

  const handleExpandChange = (event) => {
    props.onItemClick({
      item: event.item,
      event,
    });
  };

  const handleItemClick = (event) => {
    if (event.item) {
      props.onItemClick({
        item: event.item,
        event,
      });
    }
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    props.onContextMenu({
      tree: true,
      dataItem: item,
      event,
    });
  };

  const TreeViewItem = (props) => {
    if (props.item.edit) {
      return (
        <span>
          <input
            className="k-textbox"
            autoFocus
            value={props.item.path}
            onChange={(e) => handleEdit(e, props.item)}
            onBlur={(e) => handleBlur(e, props.item)}
          />
        </span>
      );
    }
    const name = getName(props.item.path);
    return (
      <span onContextMenu={(event) => handleContextMenu(event, props.item)}>
        {name}
      </span>
    );
  };

  return (
    <TreeView
      data={props.data}
      item={TreeViewItem}
      className="k-filemanager-treeview"
      textField="path"
      expandIcons={true}
      onExpandChange={handleExpandChange}
      onItemClick={handleItemClick}
    />
  );
};
