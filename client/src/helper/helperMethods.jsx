//helper methods

/**
 * return the {icon and type} of the extension of an item.
 * @param item a file or folder uploaded .pdf, .txt, ...
 * @returns
 */
export const convertExtensionToIcon = (item) => {
  if (!item) {
    return null;
  }
  const extension = item.split(".").length > 1 ? item.split(".")[1] : null; //get the extension of the file

  switch (extension ? extension.toLowerCase() : null) {
    case "pdf":
      return {
        iconClass: "k-i-file-pdf k-i-pdf",
        type: "Data",
      };
    case "ppt":
    case "pptx":
      return {
        iconClass: "k-i-file-ppt k-i-ppt",
        type: "Data",
      };
    case "xlsx":
    case "xls":
      return {
        iconClass: "k-i-file-data",
        type: "Data",
      };
    case "jpg":
    case "png":
      return {
        iconClass: "k-i-file-image",
        type: "Image",
      };
    case "txt":
    case "doc":
    case "docx":
      return {
        iconClass: "k-i-file-txt",
        type: "Text",
      };
    case "mp3":
    case "mp4":
    case "mp":
      return {
        iconClass: "k-i-audio",
        type: "Text",
      };
    case null:
      return {
        iconClass: "k-i-folder",
        type: "Folder",
      };
    default:
      return {
        iconClass: "k-i-file k-i-file-vertical",
        type: "Folder",
      };
  }
};

/**
 * get the name of a file
 * @param {*} path
 * @returns
 */
export const getName = (path) => {
  if (!path) {
    return path;
  }
  return path.split("/").pop();
};

/**
 * get the path of a file, excluding the name of that file.
 * @param {*} path
 * @returns
 */
export const getFolderPath = (path) => {
  if (!path) {
    return path;
  }
  const pathArr = path.split("/");
  pathArr.pop();
  return pathArr.join("/");
};

/**
 * format the date day.month.year hour:minute:second am/pm day of the week.
 * @param {*} date
 * @param {*} intl
 * @returns
 */
export const convertDateFormat = (date, intl) => {
  return date ? intl.formatDate(date, "d.MM.y  h:mm:ss aa  EEEE") : date;
};

/**
 * helper function for formatData
 * @param {*} data
 * @param {*} intl
 * @returns
 */
const mapData = (data, intl) => {
  if (!data) {
    return [];
  }

  return data.map((item) => {
    const name = getName(item.path);
    return {
      path: item.path,
      dateCreated: convertDateFormat(item.dateCreated || null, intl),
      dateModified: convertDateFormat(item.dateModified || null, intl),
      size: item.size,
      icon: convertExtensionToIcon(name),
      items: item.items && item.items.length ? mapData(item.items, intl) : [],
    };
  });
};

/**
 * creates a new array by transforming each item in the data array using the provided mapping function.
 * @param {*} data
 * @param {*} intl
 * @returns
 */
export const formatData = (data, intl) => {
  return mapData(data, intl);
};

/**
 * recursively traversing the input data, building a new tree structure by creating nested objects based on the hierarchical path of each file or folder.
 * @param {*} data [
  {
    path: 'folder1',
    items: [
      { path: 'folder1/file1.txt', size: 1024, dateCreated: new Date(), dateModified: new Date(), selected: false },
      { path: 'folder1/folder2', items: [
        { path: 'folder1/folder2/file2.txt', size: 2048, dateCreated: new Date(), dateModified: new Date(), selected: false },
        { path: 'folder1/folder2/file3.jpg', size: 4096, dateCreated: new Date(), dateModified: new Date(), selected: false },
      ], selected: false },
    ],
    selected: false
  },
  {
    path: 'folder4',
    items: [
      { path: 'folder4/file5.png', size: 8192, dateCreated: new Date(), dateModified: new Date(), selected: false },
      { path: 'folder4/file6.mp4', size: 16384, dateCreated: new Date(), dateModified: new Date(), selected: false },
    ],
    selected: false
  }
];
 * @param {*} selectedItem : set to true if the object's path matches the path of the selectedItem parameter
 * @returns 
 */
export const getFolderTree = (data, selectedItem = null) => {
  if (!data) {
    return data;
  }
  const newItems = [];

  for (let index = 0; index < data.length; index++) {
    const currentItem = { ...data[index] };
    if (currentItem.path && !currentItem.path.includes(".")) {
      if (currentItem.items && currentItem.items.length) {
        currentItem.items = getFolderTree(currentItem.items, selectedItem);
      }
      newItems.push({
        ...currentItem,
        selected: selectedItem ? selectedItem.path === currentItem.path : false,
      });
    }
  }
  return newItems;
};

/**
 * search for specific item in a tree
 * @param {*} data the array of objects representing the hierarchical data,
 * @param {*} selectedItem the tree item to search for.
 * @returns
 */
export const searchTreeItem = (data, selectedItem) => {
  if (!selectedItem) {
    return data;
  }

  for (let index = 0; index < data.length; index++) {
    const currentItem = data[index];
    if (currentItem.path === selectedItem.path) {
      return currentItem;
    }
    if (currentItem.items && currentItem.items.length) {
      const foundItem = searchTreeItem(currentItem.items, selectedItem);
      if (foundItem) {
        return foundItem;
      }
    }
  }
};

/**
 * returns the updated data array after adding the new files to the file system.
 * @param {*} data an array of objects that represent files and/or folders.
 * @param {*} selectedItem the currently selected item in the file system. If a selectedItem is specified,
 * the files will be added to the selected item as children; otherwise, they will be added to the root level
 * of the file system.
 * @param {*} files an array of objects representing the files to be added.
 * Each file object should have a name, size, and extension.
 * @param {*} intl an object containing internationalization settings for formatting dates.
 * @returns
 */

export const addDataItem = (data, selectedItem, files, intl) => {
  if (!selectedItem) {
    files.forEach((file) => {
      data.push({
        path: `Home/${file.name}`,
        dateCreated: convertDateFormat(new Date(), intl),
        dateModified: convertDateFormat(new Date(), intl),
        size: file.size,
        icon: convertExtensionToIcon(file.extension),
      });
    });

    return data;
  }

  if (!data) {
    return data;
  }

  return data.map((item) => {
    const currentItem = { ...item };

    if (currentItem.path === selectedItem.path) {
      files.forEach((file) => {
        if (!currentItem.items) {
          currentItem.items = [];
        }

        currentItem.items.push({
          path: `${currentItem.path}/${file.name}`,
          dateCreated: convertDateFormat(new Date(), intl),
          dateModified: convertDateFormat(new Date(), intl),
          size: file.size,
          icon: convertExtensionToIcon(file.extension),
        });
      });
    } else if (currentItem.items && currentItem.items.length) {
      currentItem.items = addDataItem(
        currentItem.items,
        selectedItem,
        files,
        intl
      );
    }

    return currentItem;
  });
};

let FOLDER_NAME_COUNTER = 0;
export const addFolder = (data, selectedItem, intl) => {
  if (!selectedItem) {
    const folderName = FOLDER_NAME_COUNTER
      ? `New Folder (${FOLDER_NAME_COUNTER})`
      : "New Folder";
    FOLDER_NAME_COUNTER++;

    data.push({
      path: `Home/${folderName}`,
      dateCreated: convertDateFormat(new Date(), intl),
      dateModified: convertDateFormat(new Date(), intl),
      size: 124,
      icon: convertExtensionToIcon(folderName),
    });

    return data.map((item) => item);
  }

  if (!data) {
    return data;
  }

  return data.map((item) => {
    const currentItem = { ...item };

    if (currentItem.path === selectedItem?.path) {
      const folderName = FOLDER_NAME_COUNTER
        ? `New Folder (${FOLDER_NAME_COUNTER})`
        : "New Folder";
      FOLDER_NAME_COUNTER++;

      if (!currentItem.items) {
        currentItem.items = [];
      }

      currentItem.items.push({
        path: `${currentItem.path}/${folderName}`,
        dateCreated: convertDateFormat(new Date(), intl),
        dateModified: convertDateFormat(new Date(), intl),
        size: 124,
        icon: convertExtensionToIcon(folderName),
      });
    } else if (currentItem.items && currentItem.items.length) {
      addFolder(currentItem.items, selectedItem, intl);
    }

    return currentItem;
  });
};

export const toggleViewBtnGroup = (btnGroupState, view) => {
  if (!btnGroupState.listView && view !== "grid") {
    return { gridView: false, listView: true };
  }
  if (!btnGroupState.gridView && view !== "list") {
    return { gridView: true, listView: false };
  }
  return btnGroupState;
};

export const toggleSortBtnGroup = (btnGroupState, curState) => {
  if (!btnGroupState.sortDesc && curState !== "asc") {
    return { sortAsc: false, sortDesc: true };
  }
  if (!btnGroupState.sortAsc && curState !== "desc") {
    return { sortAsc: true, sortDesc: false };
  }
  return btnGroupState;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const editDataItem = (data, selectedItem, newPath) => {
  if (!data) {
    return data;
  }
  const newItems = [];

  for (let index = 0; index < data.length; index++) {
    const currentItem = { ...data[index] };
    if (currentItem.path === selectedItem.path) {
      currentItem.path = newPath;
      currentItem.dateModified = new Date();
    }

    if (currentItem.items) {
      currentItem.items = editDataItem(
        currentItem.items,
        selectedItem,
        newPath
      );
    }
    newItems.push(currentItem);
  }
  return newItems;
};

export const removeDataItem = (data, selectedItem) => {
  if (!data) {
    return data;
  }
  const newItems = [];

  for (let index = 0; index < data.length; index++) {
    const currentItem = { ...data[index] };
    if (currentItem.path !== selectedItem.path) {
      if (currentItem.items && currentItem.items.length) {
        currentItem.items = removeDataItem(currentItem.items, selectedItem);
      }

      newItems.push(currentItem);
    }
  }
  return newItems;
};

export const convertToBreadcrumbData = (selectedItem) => {
  let path = [];

  if (!selectedItem) {
    return [
      {
        id: "Home",
        name: "Home",
        iconClass: "k-i-home",
      },
    ];
  }

  if (selectedItem.path) {
    const items = selectedItem.path.split("/");
    let curItemPath = [];

    for (let i = 0; i < items.length; i++) {
      curItemPath.push(items[i]);

      if (items[i] === "Home") {
        path.push({
          id: "Home",
          name: items[i],
          iconClass: "k-i-home",
        });
      } else {
        path.push({
          id: curItemPath.join("/"),
          name: items[i],
        });
      }
    }
  }
  return path;
};
