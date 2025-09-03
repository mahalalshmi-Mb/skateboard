import React from "react";
import Modal from "react-bootstrap/Modal";

const MobileModalHeader = ({child, setShowModalNav}) => {

    return(
        <div className="laxMobileNavContainer">
            {child}
        </div>
    )
}

export default MobileModalHeader;