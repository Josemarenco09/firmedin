import { Link } from "react-router-dom";
import logo from "../../assets/logo_firma_pagina.png";

const stylesImage = {
  width: "150px",
};

function Image() {
  return (
    <>
      <Link to="/inicio">
        <img src={logo} alt="FirmaVault" style={stylesImage}></img>
      </Link>
    </>
  );
}
export default Image;
