import { Drawer } from "@material-ui/core";
import NavContent from "./NavContent.jsx";
import "./sidebar.scss";

function Sidebar({supportedNetwork}) {
  return (
    <div className={`sidebar`} id="sidebarContent">
      <Drawer variant="permanent" anchor="left">
        <NavContent supportedNetwork={supportedNetwork}/>
      </Drawer>
    </div>
  );
}

export default Sidebar;
