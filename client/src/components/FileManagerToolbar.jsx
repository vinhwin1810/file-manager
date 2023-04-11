import React, { useState } from "react";
import {
  Toolbar,
  Button,
  ButtonGroup,
  SplitButton,
} from "@progress/kendo-react-buttons";
import { Switch, Input } from "@progress/kendo-react-inputs";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Upload } from "@progress/kendo-react-upload";
import {
  toggleViewBtnGroup,
  toggleSortBtnGroup,
} from "../helper/helperMethods";
import { Label } from "@progress/kendo-react-labels";
import "../styles/filemanagertoolbar.css";

export const FileManagerToolbar = (props) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [viewBtnGroup, setViewBtnGroup] = useState({
    gridView: true,
    listView: false,
  });

  const handleSearchChange = (event) => {
    props.onSearchChange(event);
  };

  const handleSwitchChange = (event) => {
    props.onSwitchChange(event);
  };

  const handleGridViewChange = (event) => {
    if (event) {
      const newBtnGroupState = toggleViewBtnGroup(viewBtnGroup, "grid");
      setViewBtnGroup(newBtnGroupState);

      props.onViewChange({
        viewValue: newBtnGroupState,
        event: event,
      });
    }
  };

  const handleAscBtnClick = (event) => {
    if (event) {
      const newBtnGroupState = toggleSortBtnGroup(props.sort[0].dir, "asc");
      props.onSortChange({
        direction: "asc",
        sortValue: newBtnGroupState,
        event: event,
      });
    }
  };

  const handleDescSortBtnClick = (event) => {
    const newBtnGroupState = toggleSortBtnGroup(props.sort[0].dir, "desc");
    props.onSortChange({
      direction: "desc",
      sortValue: newBtnGroupState,
      event: event,
    });
  };

  const handleListViewChange = (event) => {
    if (event) {
      const newBtnGroupState = toggleViewBtnGroup(viewBtnGroup, "list");
      setViewBtnGroup(newBtnGroupState);

      props.onViewChange({
        viewValue: newBtnGroupState,
        event: event,
      });
    }
  };

  const handleItemClick = (event) => {
    props.onSortChange(event);
  };

  const handleNewFolderClick = (event) => {
    props.onNewFolderClick(event);
  };

  const handleDialogVisibility = (event) => {
    setDialogVisible(!dialogVisible);
  };

  const handleFileChange = (event) => {
    props.onFileChange({
      files: event.newState,
      event: event,
    });
  };

  const handleUploadClearList = (event) => {
    props.onClearFileList(event);
  };

  const handleUploadDone = (event) => {
    setDialogVisible(!dialogVisible);
    props.onUploadComplete(event);
  };

  return (
    <Toolbar className="k-filemanager-toolbar">
      <Button onClick={handleNewFolderClick}>New Folder</Button>
      <Button onClick={handleDialogVisibility}>Upload</Button>
      {dialogVisible && (
        <Dialog
          title={"Upload Files"}
          className={"k-filemanager-upload-dialog"}
          onClose={handleDialogVisibility}
          contentStyle={{ width: "530px" }}
        >
          <div style={{ display: "grid", gridTemplateRows: "1fr auto" }}>
            <div style={{ marginBottom: "20px" }}>
              <Upload
                batch={false}
                multiple={true}
                files={props.files}
                withCredentials={false}
                onAdd={handleFileChange}
                onRemove={handleFileChange}
                onProgress={handleFileChange}
                onStatusChange={handleFileChange}
                saveUrl={""}
                removeUrl={""}
              />
            </div>
            <DialogActionsBar layout={"end"}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Button onClick={handleUploadClearList}> Clear List</Button>
                <Button themeColor={"primary"} onClick={handleUploadDone}>
                  {" "}
                  Done{" "}
                </Button>
              </div>
            </DialogActionsBar>
          </div>
        </Dialog>
      )}
      <ButtonGroup>
        <Button
          togglable={true}
          icon="k-icon k-i-sort-asc-sm"
          selected={props.sort[0].dir === "asc"}
          onClick={handleAscBtnClick}
        />
        <Button
          togglable={true}
          icon="k-icon k-i-sort-desc-sm"
          selected={props.sort[0].dir === "desc"}
          onClick={handleDescSortBtnClick}
        />
      </ButtonGroup>
      <SplitButton
        text={"Sort By"}
        items={props.splitItems}
        onItemClick={handleItemClick}
      ></SplitButton>
      <ButtonGroup>
        <Button
          togglable={true}
          icon="k-icon k-i-grid-layout"
          selected={viewBtnGroup.gridView}
          onClick={handleGridViewChange}
        />
        <Button
          togglable={true}
          icon="k-icon k-i-grid"
          selected={viewBtnGroup.listView}
          onClick={handleListViewChange}
        />
      </ButtonGroup>

      <div className="k-spacer">&nbsp;</div>
      <Button onClick={() => (window.location.href = "/profile")}>
        Update your Profile!
      </Button>
      <div className="k-spacer">&nbsp;</div>

      <div className="k-filemanager-details-toggle">
        <Label>View Details </Label>
        <Switch defaultChecked={true} onChange={handleSwitchChange} />
      </div>
      <div className="k-filemanager-search-tool k-textbox k-toolbar-last-visible">
        <Input
          className="k-input"
          placeholder="Search"
          onChange={handleSearchChange}
        />
        <span className="k-input-icon">
          <span className="k-icon k-i-search"></span>
        </span>
      </div>
    </Toolbar>
  );
};
