import { Breadcrumb } from "@progress/kendo-react-layout";

export const BreadcrumbComponent = (props) => {
  const handleItemSelect = (e) => {
    props.onBreadcrumbSelect(e);
  };

  const handleKeyDown = (e) => {
    props.onBreadcrumbSelect(e);
  };

  return (
    <Breadcrumb
      data={props.data ? props.data : ""}
      textField={"name"}
      onItemSelect={handleItemSelect}
      onKeyDown={handleKeyDown}
    />
  );
};
