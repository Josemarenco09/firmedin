const stylesImage = {
  width: "150px",
};

import reactLogo from "../../assets/logo_firma_pagina.png";

function Image() {
  return (
    <>
      <img src={reactLogo} style={stylesImage}></img>
    </>
  );
}
export default Image;
