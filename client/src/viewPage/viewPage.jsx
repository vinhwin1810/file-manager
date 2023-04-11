import React, { useState, useCallback } from "react";

import "@progress/kendo-theme-default/dist/all.css";
import { Splitter } from "@progress/kendo-react-layout";
import { useInternationalization } from "@progress/kendo-react-intl";
import { process } from "@progress/kendo-data-query";
import { clone, getter } from "@progress/kendo-react-common";
import { getSelectedState } from "@progress/kendo-react-grid";

import { FileManagerToolbar } from "../components/FileManagerToolbar";
import { GridView } from "../components/GridView";
import { ListView } from "../components/ListView";
import { FileInformation } from "../components/FileInformation";
import { FolderTree } from "../components/FolderTree";
import { BreadcrumbComponent } from "../components/Breadcrumb";
import { DeleteDialog, EditDialog } from "../components/Dialog";

import { useThemeSwitcher } from "react-css-theme-switcher";
import { Switch } from "@progress/kendo-react-inputs";

import { serverData } from "../data/data";
import {
  formatData,
  getFolderTree,
  searchTreeItem,
  addDataItem,
  addFolder,
  convertExtensionToIcon,
  convertToBreadcrumbData,
  removeDataItem,
  editDataItem,
  getFolderPath,
} from "../helper/helperMethods";
import { ContextMenu } from "../components/ContextMenu";

const splitterPanes = [
  {
    size: "20%",
    min: "20px",
    collapsible: true,
  },
  {},
  {
    size: "30%",
    min: "20px",
    collapsible: true,
  },
];

const initialSort = [
  {
    field: "path",
    dir: "asc",
  },
];

const DATA_ITEM_KEY = "path";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const View = () => {
  const intl = useInternationalization();

  const [stateData, setStateData] = useState(formatData(serverData, intl));
  const [panes, setPanes] = useState(splitterPanes);

  const [selectedGridItem, setSelectedGridItem] = useState({});
  const [selectedTreeItem, setSelectedTreeItem] = useState(null);
  const [gridSelection, setGridSelection] = useState({});

  const [detailsData, setDetailsData] = useState(null);
  const [files, setFiles] = useState([]);
  const [contentView, setContentView] = useState("grid");
  const [contextMenuView, setContextMenuView] = useState(false);
  const [menuOffSet, setMenuOffSet] = useState({ left: 0, top: 0 });
  const [editDialogView, setEditDialogView] = useState(false);
  const [deleteDialogView, setDeleteDialogView] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const { switcher, status, themes } = useThemeSwitcher();

  const splitBtnItems = [
    { text: "Name", value: "path" },
    { text: "File Size", value: "size" },
    { text: "Date Created", value: "dateCreated" },
  ];

  const initialLogic = "and";

  const [stateContentData, setStateContentData] = useState({
    sort: initialSort,
    filter: {
      logic: initialLogic,
      filters: [{ field: "path", operator: "contains", value: "" }],
    },
  });
  const updateFileDetailsData = useCallback(
    (selection) => {
      if (selection.path) {
        const newSelectedItem = searchTreeItem(stateData, selection);
        setDetailsData(newSelectedItem);
      } else if (!selection.path && Object.keys(selection).length) {
        setDetailsData(Object.keys(selection).length);
      } else {
        setDetailsData(null);
      }
    },
    [stateData]
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    switcher({ theme: isDarkMode ? themes.dark : themes.light });
  };

  // Avoid theme change flicker
  if (status === "loading") {
    return null;
  }

  const handleTreeItemClick = (event) => {
    const newSelectedItem = searchTreeItem(stateData, event.item);
    newSelectedItem.expanded = !event.item.expanded;

    setSelectedTreeItem(newSelectedItem);
    setDetailsData(event.item);
    setSelectedGridItem({});
    setGridSelection({});
  };

  const handleSplitterChange = (event) => {
    setPanes(event.newState);
  };

  const handleSelectionChange = (event) => {
    setSelectedGridItem(event.dataItem);
    updateFileDetailsData(event.dataItem);
    if (event.dataItem.path) {
      const key = event.dataItem["path"];
      setGridSelection({ [key]: true });
    }
  };

  const handleMultipleSelection = (event) => {
    const newSelection = getSelectedState({
      event,
      selectedState: gridSelection,
      dataItemKey: DATA_ITEM_KEY,
    });

    setGridSelection(newSelection);
    updateFileDetailsData(newSelection);
  };

  const handleSortChange = (event) => {
    const newSortedData = clone(stateContentData);

    if (event.direction === "asc" || event.direction === "desc") {
      newSortedData.sort[0].dir = event.direction;
    }

    if (event.item) {
      newSortedData.sort[0].field = event.item.value;
    }

    if (event.sort) {
      newSortedData.sort = event.sort;
    }
    setStateContentData(newSortedData);
  };

  const handleGridDoubleClick = (event) => {
    const itemType = convertExtensionToIcon(event.dataItem.path);
    if (itemType?.type === "Folder") {
      if (selectedTreeItem) {
        selectedTreeItem.expanded = true;
      }

      const newSelectedItem = event.dataItem;
      newSelectedItem.expanded = true;
      setSelectedTreeItem(searchTreeItem(stateData, newSelectedItem));
    }
  };

  const handleNewFolderClick = (event) => {
    let newData;
    if (selectedTreeItem) {
      newData = addFolder(stateData, selectedTreeItem, intl);
      const newTreeItem = searchTreeItem(newData, selectedTreeItem);
      setSelectedTreeItem(newTreeItem);
    } else {
      newData = addFolder(stateData, null, intl);
    }
    setStateData(newData);
  };

  const handleSearchChange = (event) => {
    let eventPath = "";
    if (selectedTreeItem?.items) {
      const curPath = getFolderPath(selectedTreeItem.items[0].path);
      eventPath = `${curPath}/${event.value}`;
    } else {
      const curPath = getFolderPath(stateData[0].path);
      eventPath = `${curPath}/${event.value}`;
    }

    setStateContentData({
      ...stateContentData,
      filter: {
        logic: initialLogic,
        filters: [{ field: "path", operator: "contains", value: eventPath }],
      },
    });
  };

  const handleSwitchChange = (event) => {
    const newPanes = panes.slice(0);
    if (event.value) {
      newPanes[2].size = "30%";
      setPanes(newPanes);
    } else {
      newPanes[2].size = "0%";
      setPanes(newPanes);
    }
  };

  const handleViewChange = (event) => {
    if (event.viewValue.gridView) {
      setContentView("grid");
    }
    if (event.viewValue.listView) {
      setContentView("list");
    }
  };

  const handleFileChange = (event) => {
    if (event.files) {
      setFiles(event.files);
    }
  };

  const handleClearFileList = (event) => {
    if (event) {
      setFiles([]);
    }
  };

  const handleUploadComplete = (event) => {
    const newData = addDataItem(stateData, selectedTreeItem, files, intl);

    setStateData(newData);
    setFiles([]);
  };

  const handleBreadcrumbSelection = (event) => {
    setSelectedGridItem({});
    setGridSelection({});

    if (!event.nativeEvent.keyCode) {
      const newItem = searchTreeItem(stateData, { path: event.id });
      setSelectedTreeItem(newItem);
    }

    if (event.nativeEvent.keyCode === 13) {
      const newItem = searchTreeItem(stateData, { path: event.id });
      setSelectedTreeItem(newItem);
    }
  };

  const handleDialogClick = (event) => {
    if (event.type === "cancel") {
      setDeleteDialogView(false);
      setEditDialogView(false);
    }

    const curItem = Object.keys(selectedGridItem).length
      ? selectedGridItem
      : selectedTreeItem;
    if (!curItem) {
      return;
    }

    if (event.type === "delete") {
      const newItem = curItem.path || "";
      const oldPath = newItem.split("/");

      oldPath.pop();

      const updatedData = removeDataItem(stateData, curItem);
      let newItemPath = oldPath.join("/");

      setSelectedTreeItem(searchTreeItem(updatedData, { path: newItemPath }));
      setStateData(updatedData);
      setDeleteDialogView(false);
    }

    if (event.type === "rename") {
      const folderPath = getFolderPath(event.path);
      const newPath = `${folderPath}/${event.value}`;

      const existingItem = searchTreeItem(stateData, { path: newPath });
      if (!existingItem) {
        const updatedData = editDataItem(stateData, curItem, newPath);
        setSelectedTreeItem(searchTreeItem(updatedData, { path: newPath }));
        setStateData(updatedData);
      }
      setEditDialogView(false);
    }
  };

  const handleListItemClick = (event) => {
    let newSelectedGridItem = {};
    if (event.dataItem.path) {
      newSelectedGridItem = event.dataItem;
      newSelectedGridItem[event.dataItem.path] = true;
      newSelectedGridItem["selected"] = true;

      setSelectedGridItem(newSelectedGridItem);
      if (event.dataItem.path) {
        const key = event.dataItem.path.toString();
        setGridSelection({ [key]: true });
      }
    }

    if (event.tree) {
      const newSelectedTreeItem = searchTreeItem(
        stateData,
        newSelectedGridItem
      );
      setSelectedTreeItem(newSelectedTreeItem);
    }
    updateFileDetailsData(newSelectedGridItem);
  };

  const handleContextMenuView = (event) => {
    setContextMenuView(true);
    setMenuOffSet({ left: event.event.clientX, top: event.event.clientY });
    handleListItemClick(event);
  };

  const handleContextMenuClick = (event) => {
    if (event.itemId === "0") {
      setEditDialogView(true);
    } else {
      setDeleteDialogView(true);
    }
  };

  const handleDialogClose = () => {
    setDeleteDialogView(false);
    setEditDialogView(false);
  };

  document.addEventListener("click", () => {
    setContextMenuView(false);
  });

  return (
    <div className="k-widget k-filemanager k-filemanager-resizable">
      <div className="main fade-in k-body">
        <Switch checked={isDarkMode} onChange={toggleTheme} />
      </div>
      <div className="k-filemanager-header">
        <FileManagerToolbar
          splitItems={splitBtnItems}
          sort={stateContentData.sort}
          files={files}
          onNewFolderClick={handleNewFolderClick}
          onSearchChange={handleSearchChange}
          onSwitchChange={handleSwitchChange}
          onViewChange={handleViewChange}
          onSortChange={handleSortChange}
          onFileChange={handleFileChange}
          onClearFileList={handleClearFileList}
          onUploadComplete={handleUploadComplete}
        />
      </div>
      <div className="k-filemanager-content-container">
        <Splitter panes={panes} onChange={handleSplitterChange}>
          <FolderTree
            data={getFolderTree(stateData, selectedTreeItem)}
            selected={selectedTreeItem}
            selectedItem={selectedTreeItem}
            onItemClick={handleTreeItemClick}
            onContextMenu={handleContextMenuView}
          />
          <div className="k-filemanager-content">
            <BreadcrumbComponent
              data={convertToBreadcrumbData(selectedTreeItem)}
              onBreadcrumbSelect={handleBreadcrumbSelection}
            />
            {contentView === "grid" ? (
              <GridView
                data={
                  selectedTreeItem && selectedTreeItem.items
                    ? process(
                        selectedTreeItem.items.map((item) => ({
                          ...item,
                          [SELECTED_FIELD]: gridSelection[idGetter(item)],
                        })),
                        stateContentData
                      )
                    : !selectedTreeItem
                    ? process(
                        stateData.map((item) => ({
                          ...item,
                          [SELECTED_FIELD]: gridSelection[idGetter(item)],
                        })),
                        stateContentData
                      )
                    : null
                }
                sort={stateContentData.sort}
                dataItemKey={DATA_ITEM_KEY}
                onSelectionChange={handleSelectionChange}
                onMultipleSelection={handleMultipleSelection}
                onSortChange={handleSortChange}
                onDoubleClick={handleGridDoubleClick}
                onContextMenu={handleContextMenuView}
              />
            ) : (
              <ListView
                data={
                  selectedTreeItem && selectedTreeItem.items
                    ? process(
                        selectedTreeItem.items.map((item) => ({
                          ...item,
                          [SELECTED_FIELD]: gridSelection[idGetter(item)],
                        })),
                        stateContentData
                      )
                    : !selectedTreeItem
                    ? process(
                        stateData.map((item) => ({
                          ...item,
                          [SELECTED_FIELD]: gridSelection[idGetter(item)],
                        })),
                        stateContentData
                      )
                    : null
                }
                onSelectionChange={handleSelectionChange}
                onMultipleSelection={handleMultipleSelection}
                onItemClick={handleListItemClick}
                onDoubleClick={handleGridDoubleClick}
                onContextMenu={handleContextMenuView}
              />
            )}
            {contextMenuView ? (
              <ContextMenu
                offset={menuOffSet}
                onContextMenuCLick={handleContextMenuClick}
              />
            ) : (
              ""
            )}
            {editDialogView ? (
              <EditDialog
                editValue={
                  Object.keys(selectedGridItem).length
                    ? selectedGridItem
                    : selectedTreeItem
                }
                onDialogClose={handleDialogClose}
                onDialogClick={handleDialogClick}
              />
            ) : (
              ""
            )}
            {deleteDialogView ? (
              <DeleteDialog
                onDialogClose={handleDialogClose}
                onDialogClick={handleDialogClick}
              />
            ) : (
              ""
            )}
          </div>
          <FileInformation data={detailsData} />
        </Splitter>
      </div>
    </div>
  );
};

export default View;
