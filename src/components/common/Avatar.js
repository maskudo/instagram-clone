function Avatar(props) {
  const bgStylingObject = {
    backgroundImage: `url('${props.photo}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: `${props.size}rem`,
    width: `${props.size}rem`,
  };
  return (
    <div style={bgStylingObject} className=" rounded-circle shadow-sm"></div>
  );
}

export default Avatar;
