import { classNames } from "@progress/kendo-react-common";
import { getName } from "../helper/helperMethods";

export const ListView = (props) => {
  const handleClick = (event, item) => {
    props.onItemClick({
      dataItem: item,
      event: event,
    });
  };

  const handleDoubleClick = (event, item) => {
    props.onDoubleClick({
      dataItem: item,
      event: event,
    });
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    props.onContextMenu({
      dataItem: item,
      event: event,
    });
  };

  return (
    <div className="k-listview k-selectable k-filemanager-listview">
      <div className="k-listview-content k-d-flex k-flex-row k-flex-wrap">
        {props.data
          ? props.data.data.map((item) => {
              const name = getName(item.path);
              return (
                <div
                  className={classNames("k-listview-item", {
                    "k-selected": item.selected,
                  })}
                  onClick={(event) => handleClick(event, item)}
                  onDoubleClick={(event) => handleDoubleClick(event, item)}
                  onContextMenu={(event) => handleContextMenu(event, item)}
                >
                  <span className="k-file-preview">
                    <span
                      className={classNames(
                        "k-file-icon k-icon",
                        item.icon ? item.icon.iconClass : ""
                      )}
                    />
                  </span>
                  <span className="k-file-name">{name}</span>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
};
