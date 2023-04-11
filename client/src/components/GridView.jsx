import React from "react";
import {
  Grid,
  GRID_COL_INDEX_ATTRIBUTE,
  GridColumn as Column,
} from "@progress/kendo-react-grid";
import { useTableKeyboardNavigation } from "@progress/kendo-react-data-tools";

import { useInternationalization } from "@progress/kendo-react-intl";
import { classNames } from "@progress/kendo-react-common";
import {
  convertDateFormat,
  getName,
  formatBytes,
} from "../helper/helperMethods";

const DateCreatedCell = (props) => {
  const intl = useInternationalization();

  const field = props.field || "";
  const date = props.dataItem[field];
  const navigationAttributes = useTableKeyboardNavigation(props.id);

  return (
    <td
      {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
      {...navigationAttributes}
    >
      {date === null ? "" : convertDateFormat(date, intl)}
    </td>
  );
};

const SizeCell = (props) => {
  const size = props.dataItem[props.field || ""];
  const navigationAttributes = useTableKeyboardNavigation(props.id);

  return (
    <td
      {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
      {...navigationAttributes}
    >
      {size === null ? "" : formatBytes(size)}
    </td>
  );
};

const NameCell = (props) => {
  const navigationAttributes = useTableKeyboardNavigation(props.id);
  const name = getName(props.dataItem.path);

  return (
    <td
      {...{ [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex }}
      {...navigationAttributes}
    >
      <span
        className={classNames(
          "k-icon",
          props.dataItem.icon ? props.dataItem.icon.iconClass : ""
        )}
      />
      {name}
    </td>
  );
};

export const GridView = (props) => {
  const RowRender = (trElement, dataItem) => {
    const trProps = {
      onContextMenu: (event) => {
        event.preventDefault();
        handleContextMenu(event, dataItem);
      },
    };
    return React.cloneElement(
      trElement,
      { ...trProps },
      trElement.props.children
    );
  };

  const handleOnSortChange = (event) => {
    props.onSortChange({
      sort: event.sort,
      event: event,
    });
  };

  const handleSelectionChange = (event) => {
    props.onSelectionChange(event);
  };

  const handleMultipleSelection = (event) => {
    props.onMultipleSelection(event);
  };

  const handleDoubleClick = (event) => {
    props.onDoubleClick(event);
  };

  const handleContextMenu = (event, dataItem) => {
    props.onContextMenu({
      dataItem: dataItem.dataItem,
      event: event,
    });
  };

  return (
    <Grid
      data={props.data}
      rowRender={RowRender}
      className={"k-filemanager-grid k-grid-display-block k-editable"}
      style={{ height: "100%" }}
      navigatable={true}
      sortable={{
        allowUnsort: false,
      }}
      sort={props.sort}
      selectedField={"selected"}
      selectable={{ enabled: true, cell: false, drag: true, mode: "multiple" }}
      dataItemKey={props.dataItemKey}
      onRowClick={handleSelectionChange}
      onSelectionChange={handleMultipleSelection}
      onSortChange={handleOnSortChange}
      onRowDoubleClick={handleDoubleClick}
    >
      <Column field="path" title="Name" cell={NameCell} />
      <Column field="dateCreated" title="Date Created" cell={DateCreatedCell} />
      <Column field="size" title="Size" cell={SizeCell} />
    </Grid>
  );
};
