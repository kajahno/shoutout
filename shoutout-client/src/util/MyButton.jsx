import { IconButton, Tooltip } from "@material-ui/core";
import React from "react";

export default ({ children, onClick, tip, btnClassName, tipClassName, ...props }) => (
    <Tooltip title={tip} className={tipClassName} {...props}>
        <IconButton onClick={onClick} className={btnClassName}>
            {children}
        </IconButton>
    </Tooltip>
);
